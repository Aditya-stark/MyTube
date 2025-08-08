from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

_vectorizer = TfidfVectorizer(stop_words="english")

def compute_tfidf_matrix(texts):
    # texts: list[str], length == number of videos Example texts: ["video1 title description", "video2 title description"]
    return _vectorizer.fit_transform(texts)

def compute_similarity(tfidf_matrix, index: int):
    # Return a 1D numpy array of length N with similarity to every video
    sims = cosine_similarity(tfidf_matrix[index], tfidf_matrix)   # shape (1, N)
    return np.asarray(sims).ravel()
