# Predicting popularity and audience engagement in TED talks based on language usage
![alt text](https://github.com/ivapezo/podcast-engagement/blob/main/workfile-1.png)

### The goals of the project
What contributes to the broad appeal of a TED talk? Is it the speakers's upbeat and positive energy that captures the audience's attention, or does a rich and profound vocabulary play a crucial role? While we all have our personal assumptions and preferences regarding the factors that make a talk successful and beloved, this project delves into the linguistic aspects present in the transcripts to unravel the nuances that contribute to a talk's impact and resonance.

The primary objective of this project is to explore how various elements of a TED talk, including vocabulary diversity, distinctiveness, emotion, and syntax, relate to user engagement. The goal is to develop models using different textual representations and identify which features are predictive of popularity and engagement - the characteristics that keep people listening.

### Approaches and baselines
Two main approaches for predicting popularity and engagement are:

1. Classical machine learning models: This approach relies on linguistic features extracted from the transcripts, employing traditional machine learning models to make predictions.

2. Pre-trained BERT model: The second approach involves utilizing a pre-trained BERT model for predictions based on the content of the transcripts leveraging the power of contextualized language representations to enhance predictive accuracy.


This project draws inspiration from a 2021 [paper](https://aclanthology.org/2021.acl-long.52.pdf), where the authors employed various classifiers, including logistic regression with different content representations and two neural classifiers—a single-hidden-layer feedforward neural network and the pre-trained BERT model. The focus was on predicting listener engagement in both Spotify podcasts and TED talks. The aim of this project is not only to replicate but also to surpass the best performances reported in the paper by leveraging the advancements in state-of-the-art language models.

In the original paper, the highest accuracy achieved for predicting engagement in TED talks using linguistic features and a logistic regression model was 71.15%. Furthermore, the best overall accuracy, reaching 71.92%, was attained with the utilization of pre-trained BERT. This project aims to push beyond these benchmarks by leveraging the latest advancements in language model technologies.

### The data 

The datasets contain information about all audio-video recordings of TED Talks uploaded to the official TED.com website until September 21st, 2017. The TED main dataset contains information about all talks including number of views, number of comments, descriptions, speakers and titles. The TED transcripts dataset contains the transcripts for all talks available on TED.com.

- https://www.kaggle.com/datasets/rounakbanik/ted-talks?select=ted_main.csv

### Relevant scientific papers
* Modeling Language Usage and Listener Engagement in Podcasts
  * https://aclanthology.org/2021.acl-long.52.pdf
    * The paper used for inspiration 
* Predicting TED Talk Ratings from Language and Prosody
  * [https://aclanthology.org/2020.coling-main.519.pdf](https://arxiv.org/abs/1906.03940)
* Language that Captivates the Audience
  * https://aclanthology.org/2021.wassa-1.2.pdf


### Work-breakdown 

Task  | Effort in hours
------------- | -------------
Data collection | 2 weeks + (waiting for a response from Spotify)
Research around linguistic features | 12h
Data exploration & defining target variables | 12h
Linguistic features determination | 15h
Predictions with linguistic features | 10h
Predictions with BERT | 30h
Finalisation & Report | 5h

### Results

The best accuracies of 90% (for popularity prediction) and 80% (for engagement prediction) were achieved using solely linguistic features on the complete dataset. However, due to class imbalance present in the dataset, an F1-score of 77% (for popularity prediction) and 52% (for engagement prediction) were achieved. In order to obtain higher precision and recall, we balance the dataset and then get 85% accuracy and 86% F1-score for popularity and 81% accuracy and 82% F1-score for engagement prediction.
