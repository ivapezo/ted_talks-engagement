from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import joblib
import numpy as np
import yt_dlp
from youtube_transcript_api import YouTubeTranscriptApi
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import random
import nltk
import textstat
from nltk.tokenize import word_tokenize
from collections import Counter
import math
import logging
from functools import lru_cache
import re
import os
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Add rate limiting
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

# Cache models and vectorizers at startup
try:
    # Use absolute paths for model files
    model_path = os.path.join(os.path.dirname(__file__), 'models')
    model_popularity = joblib.load(os.path.join(model_path, 'rfc_popularity (2).sav'))
    model_engagement = joblib.load(os.path.join(model_path, 'rfc_engagement (2).sav'))
    tfidf_vectorizer = joblib.load(os.path.join(model_path, 'tfidf_vectorizer.pkl'))
    count_vectorizer = joblib.load(os.path.join(model_path, 'count_vectorizer.pkl'))
    le_tags = joblib.load(os.path.join(model_path, 'le_tags.pkl'))
    logger.info("Successfully loaded all models and vectorizers")
except Exception as e:
    logger.error(f"Error loading models: {str(e)}")
    raise

# Download NLTK data at startup
nltk.download('punkt', quiet=True)

def validate_youtube_url(url):
    """Validate YouTube URL format."""
    youtube_regex = r'(https?://)?(www\.)?(youtube\.com/watch\?v=|youtu\.be\/)([^&\n?]+)'
    return bool(re.match(youtube_regex, url))

@lru_cache(maxsize=100)
def get_video_info(video_url):
    """Cache video info to avoid repeated API calls."""
    ydl_opts = {'quiet': True}
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(video_url, download=False)
            return info_dict
    except Exception as e:
        logger.error(f"Error fetching video info: {str(e)}")
        raise

def get_words_per_sec(transcript, duration):
    """Calculate words per second efficiently."""
    return len(transcript.split()) / duration if duration > 0 else 0

@lru_cache(maxsize=100)
def get_similarity_score(transcript, words_per_sec, title):
    """Cache similarity scores for repeated calculations."""
    try:
        transcript_30s = ' '.join(transcript.split()[:int(words_per_sec) * 30])
        tfidf_matrix_title = tfidf_vectorizer.transform([title])
        tfidf_matrix_transcript = tfidf_vectorizer.transform([transcript_30s])
        cosine_similarities = cosine_similarity(tfidf_matrix_title, tfidf_matrix_transcript)
        return np.diag(cosine_similarities) * 100
    except Exception as e:
        logger.error(f"Error calculating similarity score: {str(e)}")
        return [0]

def get_distinctiveness(transcript):
    """Calculate distinctiveness with improved efficiency."""
    try:
        word_counts = count_vectorizer.transform([transcript])
        vocab = count_vectorizer.get_feature_names_out()
        count = word_counts.sum(axis=0).A1
        total_word_count = count.sum()
        probabilities = count / total_word_count if total_word_count > 0 else np.zeros_like(count)
        
        word_prob_dict = dict(zip(vocab, probabilities))
        transcript_words = word_tokenize(transcript.lower())
        
        def calculate_perplexity_subset(transcript_words, word_probabilities, subset_size=5, num_samples=3):
            subset_words = [random.sample(transcript_words, min(subset_size, len(transcript_words))) 
                          for _ in range(num_samples)]
            return np.mean([
                np.sum([-np.log2(word_probabilities.get(word, 1e-10)) for word in subset]) / len(subset)
                for subset in subset_words
            ])

        distinctiveness = calculate_perplexity_subset(transcript_words, word_prob_dict)
        return ((distinctiveness - 16.189491) / (33.219281 - 16.189491) * 100) if distinctiveness else 0
    except Exception as e:
        logger.error(f"Error calculating distinctiveness: {str(e)}")
        return 0

def calculate_entropy(transcript):
    """Calculate entropy with improved efficiency."""
    try:
        words = word_tokenize(transcript.lower())
        word_counts = Counter(words)
        total_words = len(words)
        if total_words == 0:
            return 0
        word_probabilities = {word: count / total_words for word, count in word_counts.items()}
        return -sum(prob * math.log2(prob) for prob in word_probabilities.values())
    except Exception as e:
        logger.error(f"Error calculating entropy: {str(e)}")
        return 0
    
#add test endpoint with /api. Print out that api is working
@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({'message': 'API is working'}), 200


@app.route('/api/predict', methods=['POST'])
@limiter.limit("10 per minute")
def predict():
    """Main prediction endpoint with improved error handling."""
    try:
        data = request.get_json(force=True)
        if not data or 'videoUrl' not in data:
            return jsonify({'error': 'Missing videoUrl in request'}), 400
        
        video_url = data['videoUrl']
        if not validate_youtube_url(video_url):
            return jsonify({'error': 'Invalid YouTube URL'}), 400

        all_features = get_features(video_url)
        if not all_features:
            return jsonify({'error': 'Failed to extract features from video'}), 500

        features = all_features[:-2]
        features_array = np.array(features).reshape(1, -1)

        popularity = model_popularity.predict_proba(features_array)
        engagement = model_engagement.predict_proba(features_array)
        
        all_features = [int(f) for f in all_features]
        return[
             popularity[0].tolist(),
             engagement[0].tolist(),
             all_features
        ]

    except Exception as e:
        logger.error(f"Error in predict endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

def get_features(video_url):
    """Extract features from video with improved error handling."""
    try:
        video_id = video_url.split('v=')[1]
        transcribed_video_docs_list = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
        transcript = ' '.join(part['text'] for part in transcribed_video_docs_list)

        video_info = get_video_info(video_url)
        if not video_info:
            raise ValueError("Failed to get video information")

        duration = video_info.get('duration', 0)
        languages = len(video_info.get('automatic_captions', {}))
        tags = next((tag for tag in video_info.get('tags', []) 
                    if 'TED' not in tag and 'TEDx' not in tag), None)
        
        tags = le_tags.transform([tags])[0] if tags in le_tags.classes_ else le_tags.transform(['other'])[0]
        
        month = int(video_info['upload_date'][4:6])
        year = int(video_info['upload_date'][:4])
        comment_count = video_info.get('comment_count', 0)
        like_count = video_info.get('like_count', 0)
        
        words_per_sec = get_words_per_sec(transcript, duration)
        similarity_score = get_similarity_score(transcript, words_per_sec, video_info['fulltitle'])[0]
        distinctiveness = get_distinctiveness(transcript)
        flesch_kincaid_grade_level = textstat.flesch_kincaid_grade(transcript)
        dale_chall_grade_level = textstat.dale_chall_readability_score(transcript)
        vocabulary_diversity = calculate_entropy(transcript) * 100

        return [duration, languages, tags, month, year, words_per_sec, similarity_score,
                distinctiveness, flesch_kincaid_grade_level, dale_chall_grade_level,
                vocabulary_diversity, comment_count, like_count]

    except Exception as e:
        logger.error(f"Error extracting features: {str(e)}")
        return None

if os.getenv('NODE_ENV') == 'production':
    app = app.wsgi_app
else: 
    # For local development
    if __name__ == '__main__':
        logger.info("Starting Flask application")
        app.run(port=5000)