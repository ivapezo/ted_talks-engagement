# Modelling language usage and listener engagement in Podcasts

![alt text](https://github.com/ivapezo/podcast-engagement/blob/main/criacao-podcast-BR-Capterra-Header.png)


### Goal of the project

What contributes to the broad appeal of a podcast? Is it the host's upbeat and positive energy that captures the audience's attention, or does a rich and profound vocabulary play a crucial role? We all have our individual assumptions and preferences regarding what makes a podcast successful and beloved. In this project, linguistic factors are investigated, leveraging the written descriptions of the show and episode as well as the audio transcript of the episode.

The primary objective of this project is to explore how various elements of a podcast, including vocabulary diversity, distinctiveness, emotion, and syntax, relate to user engagement. The goal is to develop models using different textual representations and identify which features are predictive of engagement - the characteristics that keep people listening to podcasts.

The project is inspired by this paper from 2021, where the authors use a logistic regression classifier with different representations of the content, and two neural classifiers - a feedforward neural network with a single hidden layer, and the pre-trained BERT. 
My goal is to develop and surpass the best performances from the paper using the current state-of-the-art language models.

### The data 
The dataset includes around 200k podcasts filtered for English and Portuguese content. Episodes vary in audio quality, topics, and structural formats due to a mix of professional and amateur content. The dataset contains both the audio and the transcripts of the episodes.
Only the English content is used.
The access to the Spotify Podcasts Dataset needs to be requested.

- https://podcastsdataset.byspotify.com/


### Relevant scientific papers
* Modeling Language Usage and Listener Engagement in Podcasts
  * https://aclanthology.org/2021.acl-long.52.pdf
    * The paper used for inspiration 
* 100,000 Podcasts: A Spoken English Document Corpus
  * https://aclanthology.org/2020.coling-main.519.pdf
* Mapping the factors that determine engagement in podcasting: design from the users and podcasters experience
  * https://www.researchgate.net/publication/340975155_Mapping_the_factors_that_determine_engagement_in_podcasting_design_from_the_users_and_podcasters'experience



### Work-breakdown 

Task  | Effort in hours
------------- | -------------
Data collection | 2 weeks +
Data preprocessing & Engagement metric calculation | 30h
Topic classification | 15h
Linguistic Features determination | 20h
Models and analysis | 20h
Building an application | 10h
Report & final presentation | 10h
