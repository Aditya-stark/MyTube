import json
import numpy as np
from utils.tfidf_utils import compute_tfidf_matrix, compute_similarity
from utils.recency_boost import recency_weight
from pymongo import MongoClient

#Connect to the database
client = MongoClient("mongodb+srv://adi:adi123@jsbackend.o2myv.mongodb.net/")
db = client["MyTube"]
videos_collection = db["videos"]
#if the database doesnt have the collection as recommendations create it or use the collection if present 
recommendations_collection = db.get_collection("recommendations")

# Check if the recommendations collection exists, create if not
if "recommendations" not in db.list_collection_names():
    recommendations_collection = db.create_collection("recommendations")


# Fetch all videos
videos = list(videos_collection.find())

#Empty list to store single video texts
video_texts = []

#Iterate through each video in the collection and extract relevant text
for video in videos:
    title = video.get("title", "")
    description = video.get("description", "")
    tags = " ".join(video.get("tags", []))
    category = video.get("category", "")
    created_at = video.get("createdAt", "")
    if isinstance(created_at, dict):
        upload_date = created_at.get("$date", "")
    else:
        upload_date = created_at

    combined_text = f"{title} {description} {tags} {category}"

    #The combined text for each video is ready
    video_texts.append(combined_text)

# Compute TF-IDF matrix    
tfidf_matrix = compute_tfidf_matrix(video_texts)

# Dictionary to hold recommendations
recommendations = {}

# Iterate through each video to compute video from all videos and find similarity scores
for idx, video in enumerate(videos):
    sim_scores = compute_similarity(tfidf_matrix, idx)  # expect 1D array length N
    vec = np.asarray(sim_scores).ravel()

    scores = []
    for j, score in enumerate(vec):
        if j == idx:
            continue  # Exclude self-comparison
        created_at = videos[j].get("createdAt", "")
        if isinstance(created_at, dict):
            upload_date = created_at.get("$date", "")
        else:
            upload_date = created_at
        recency = recency_weight(upload_date)
        final_score = float(score) * 0.7 + recency * 0.3
        scores.append((j, final_score))

    # If everything is zero (rare), fall back to recency-only ordering
    if not scores:
        top_indices = []
    else:
        top_indices = sorted(scores, key=lambda x: x[1], reverse=True)[:10]

    recommendations[video["_id"]] = [videos[i]["_id"] for i, _ in top_indices]
    

# Convert ObjectId keys and values to strings for JSON serialization
recommendations_str = {
    str(video_id): [str(rec_id) for rec_id in recs]
    for video_id, recs in recommendations.items()
}

# Save recommendations to MongoDB
with open("recommendations.json", "w") as jsonFile:
    json.dump(recommendations_str, jsonFile)

for video_id, recommended_ids in recommendations_str.items():
    recommendations_collection.update_one({"video_id": video_id}, {"$set": {"recommended_ids": recommended_ids}}, upsert=True)

# Print the recommendations
print("Recommendations stored in MongoDB.")
