import os
import json
import numpy as np
import joblib
import re
import logging
from pytube import YouTube
from youtube_transcript_api import YouTubeTranscriptApi
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import textstat
import math
from collections import Counter
import warnings

warnings.filterwarnings('ignore')

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load models
MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
rfc_popularity = joblib.load(os.path.join(MODEL_DIR, 'rfc_popularity (2).sav'))
rfc_engagement = joblib.load(os.path.join(MODEL_DIR, 'rfc_engagement (2).sav'))
tfidf_vectorizer = joblib.load(os.path.join(MODEL_DIR, 'tfidf_vectorizer.pkl'))
count_vectorizer = joblib.load(os.path.join(MODEL_DIR, 'count_vectorizer.pkl'))
le_tags = joblib.load(os.path.join(MODEL_DIR, 'le_tags.pkl'))

# NLTK setup
try: nltk.data.find('tokenizers/punkt')
except LookupError: nltk.download('punkt')

try: nltk.data.find('corpora/stopwords')
except LookupError: nltk.download('stopwords')


def calculate_entropy(transcript):
    try:
        words = word_tokenize(transcript.lower())
        stop_words = set(stopwords.words('english'))
        words = [w for w in words if w.isalnum() and w not in stop_words]
        word_counts = Counter(words)
        total_words = len(words)
        entropy = -sum((count / total_words) * math.log2(count / total_words) for count in word_counts.values())
        return entropy
    except Exception as e:
        logger.error(f"Entropy calc error: {e}")
        return 0


def get_features(video_url):
    try:
        video_id = re.search(r'(?:v=|\/)([0-9A-Za-z_-]{11}).*', video_url).group(1)
        yt = YouTube(video_url)
        video_info = yt.vid_info
        transcript = ' '.join([item['text'] for item in YouTubeTranscriptApi.get_transcript(video_id)])

        duration = int(video_info.get('videoDetails', {}).get('lengthSeconds', 0))
        languages = len(video_info.get('videoDetails', {}).get('availableLanguages', []))
        tags = video_info.get('videoDetails', {}).get('keywords', [])
        entropy = calculate_entropy(transcript)

        return {
            'duration': duration,
            'languages': languages,
            'tag_count': len(tags),
            'entropy': entropy,
            'transcript': transcript,
            'tags': tags
        }
    except Exception as e:
        logger.error(f"Feature extraction error: {e}")
        raise


def predict(video_url):
    try:
        features = get_features(video_url)

        transcript_features = tfidf_vectorizer.transform([features['transcript']])
        tag_features = count_vectorizer.transform([' '.join(features['tags'])])
        numeric_features = np.array([[features['duration'], features['languages'], features['tag_count'], features['entropy']]])

        X = np.hstack([transcript_features.toarray(), tag_features.toarray(), numeric_features])

        popularity_pred = rfc_popularity.predict(X)[0]
        engagement_pred = rfc_engagement.predict(X)[0]

        return {
            'popularity': int(popularity_pred),
            'engagement': int(engagement_pred),
            'features': {
                'duration': features['duration'],
                'languages': features['languages'],
                'tag_count': features['tag_count'],
                'entropy': features['entropy']
            }
        }
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return {'error': str(e)}


# Vercel-compatible handler
def handler(request):
    try:
        if request['method'] != 'POST':
            return {
                'statusCode': 405,
                'body': json.dumps({'error': 'Only POST allowed'}),
                'headers': {'Content-Type': 'application/json'}
            }

        body = json.loads(request['body'])
        video_url = body.get('videoUrl')

        if not video_url:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing videoUrl'}),
                'headers': {'Content-Type': 'application/json'}
            }

        result = predict(video_url)

        return {
            'statusCode': 200,
            'body': json.dumps(result),
            'headers': {'Content-Type': 'application/json'}
        }

    except Exception as e:
        logger.error(f"Handler error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
            'headers': {'Content-Type': 'application/json'}
        }
