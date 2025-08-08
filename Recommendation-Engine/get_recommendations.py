import json, random

def get_recommendations(video_id, n=5):
    with open("recommendations.json", "r") as f:
        recommendations = json.load(f)
    candidates = recommendations.get(video_id, [])
    random.shuffle(candidates)
    return candidates[:n]