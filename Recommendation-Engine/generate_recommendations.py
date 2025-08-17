from flask import Flask, jsonify, request
import json
import numpy as np
from utils.tfidf_utils import compute_tfidf_matrix, compute_similarity
from utils.recency_boost import recency_weight
from pymongo import MongoClient
from bson import ObjectId
import logging
from datetime import datetime

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RecommendationAPI:
    def __init__(self):
        # Connect to the database
        try:
            self.client = MongoClient("mongodb+srv://adi:adi123@jsbackend.o2myv.mongodb.net/")
            self.db = self.client["MyTube"]
            self.videos_collection = self.db["videos"]
            
            # Check if the recommendations collection exists, create if not
            if "recommendations" not in self.db.list_collection_names():
                self.recommendations_collection = self.db.create_collection("recommendations")
            else:
                self.recommendations_collection = self.db.get_collection("recommendations")
            
            logger.info("Successfully connected to MongoDB")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {str(e)}")
            raise

    def fetch_videos(self):
        """Fetch all videos from the database"""
        try:
            videos = list(self.videos_collection.find())
            logger.info(f"Fetched {len(videos)} videos from database")
            return videos
        except Exception as e:
            logger.error(f"Error fetching videos: {str(e)}")
            return []

    def process_video_texts(self, videos):
        """Process videos to extract text features"""
        video_texts = []
        
        for video in videos:
            title = video.get("title", "")
            description = video.get("description", "")
            tags = " ".join(video.get("tags", []))
            category = video.get("category", "")
            
            combined_text = f"{title} {description} {tags} {category}"
            video_texts.append(combined_text)
        
        return video_texts

    def generate_recommendations(self, videos, video_texts):
        """Generate recommendations for all videos"""
        try:
            # Compute TF-IDF matrix    
            tfidf_matrix = compute_tfidf_matrix(video_texts)
            recommendations = {}

            # Iterate through each video to compute similarity scores
            for idx, video in enumerate(videos):
                sim_scores = compute_similarity(tfidf_matrix, idx)
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

                # Sort by score and get top 10
                if scores:
                    top_indices = sorted(scores, key=lambda x: x[1], reverse=True)[:10]
                    recommendations[video["_id"]] = [videos[i]["_id"] for i, _ in top_indices]
                else:
                    recommendations[video["_id"]] = []

            logger.info(f"Generated recommendations for {len(recommendations)} videos")
            return recommendations
        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            return {}

    def generate_single_video_recommendations(self, videos, video_texts, video_idx):
        """Generate recommendations for a single video"""
        try:
            # Compute TF-IDF matrix    
            tfidf_matrix = compute_tfidf_matrix(video_texts)
            
            # Compute similarity scores for the specific video
            sim_scores = compute_similarity(tfidf_matrix, video_idx)
            vec = np.asarray(sim_scores).ravel()

            scores = []
            for j, score in enumerate(vec):
                if j == video_idx:
                    continue  # Exclude self-comparison
                
                created_at = videos[j].get("createdAt", "")
                if isinstance(created_at, dict):
                    upload_date = created_at.get("$date", "")
                else:
                    upload_date = created_at
                
                recency = recency_weight(upload_date)
                final_score = float(score) * 0.7 + recency * 0.3
                scores.append((j, final_score))

            # Sort by score and get top 10
            if scores:
                top_indices = sorted(scores, key=lambda x: x[1], reverse=True)[:10]
                recommendations = [videos[i]["_id"] for i, _ in top_indices]
            else:
                recommendations = []

            logger.info(f"Generated {len(recommendations)} recommendations for video at index {video_idx}")
            return recommendations
        except Exception as e:
            logger.error(f"Error generating single video recommendations: {str(e)}")
            return []

    def save_single_recommendation(self, video_id, recommendations):
        """Save recommendations for a single video to MongoDB"""
        try:
            # Convert ObjectId to strings for JSON serialization
            recommendations_str = [str(rec_id) for rec_id in recommendations]

            # Save to MongoDB
            self.recommendations_collection.update_one(
                {"video_id": video_id}, 
                {"$set": {
                    "recommended_ids": recommendations_str,
                    "updated_at": datetime.utcnow()
                }}, 
                upsert=True
            )

            logger.info(f"Recommendations saved for video {video_id} successfully")
            return True
        except Exception as e:
            logger.error(f"Error saving recommendations for video {video_id}: {str(e)}")
            return False

# Initialize the API
try:
    rec_api = RecommendationAPI()
except Exception as e:
    logger.error(f"Failed to initialize RecommendationAPI: {str(e)}")
    rec_api = None

# @app.route('/health', methods=['GET'])
# def health_check():
#     """Health check endpoint"""
#     try:
#         if rec_api and rec_api.client.admin.command('ping'):
#             return jsonify({
#                 "status": "healthy",
#                 "database": "connected",
#                 "timestamp": datetime.utcnow().isoformat()
#             }), 200
#     except:
#         pass
    
#     return jsonify({
#         "status": "unhealthy",
#         "database": "disconnected",
#         "timestamp": datetime.utcnow().isoformat()
#     }), 503

@app.route('/generate-recommendations', methods=['POST'])
def generate_recommendations():
    """Generate recommendations for all videos"""
    if not rec_api:
        return jsonify({"error": "API not initialized"}), 500
    
    try:
        # Fetch videos
        videos = rec_api.fetch_videos()
        if not videos:
            return jsonify({"error": "No videos found in database"}), 404

        # Process video texts
        video_texts = rec_api.process_video_texts(videos)
        
        # Generate recommendations
        recommendations = rec_api.generate_recommendations(videos, video_texts)
        if not recommendations:
            return jsonify({"error": "Failed to generate recommendations"}), 500

        # Save recommendations
        if rec_api.save_recommendations(recommendations):
            return jsonify({
                "message": "Recommendations generated and stored successfully",
                "videos_processed": len(videos),
                "recommendations_count": len(recommendations),
                "timestamp": datetime.utcnow().isoformat()
            }), 200
        else:
            return jsonify({"error": "Failed to save recommendations"}), 500

    except Exception as e:
        logger.error(f"Error in generate_recommendations: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/generate-recommendations/<video_id>', methods=['POST'])
def generate_recommendations_for_new_video(video_id):
    """Generate recommendations for a newly uploaded video"""
    if not rec_api:
        return jsonify({"error": "API not initialized"}), 500
    
    try:
        # Validate ObjectId format
        try:
            new_video_obj_id = ObjectId(video_id)
        except:
            return jsonify({"error": "Invalid video ID format"}), 400

        # Check if the video exists in the database
        new_video = rec_api.videos_collection.find_one({"_id": new_video_obj_id})
        if not new_video:
            return jsonify({"error": "Video not found in database"}), 404

        # Fetch all videos
        videos = rec_api.fetch_videos()
        if not videos:
            return jsonify({"error": "No videos found in database"}), 404

        # Find the index of the new video in the videos list
        new_video_idx = None
        for idx, video in enumerate(videos):
            if video["_id"] == new_video_obj_id:
                new_video_idx = idx
                break
        
        if new_video_idx is None:
            return jsonify({"error": "New video not found in videos list"}), 404

        # Process video texts
        video_texts = rec_api.process_video_texts(videos)
        
        # Generate recommendations for the new video only
        recommendations = rec_api.generate_single_video_recommendations(videos, video_texts, new_video_idx)
        if not recommendations:
            return jsonify({"error": "Failed to generate recommendations for new video"}), 500

        # Save recommendations for this specific video
        if rec_api.save_single_recommendation(video_id, recommendations):
            return jsonify({
                "message": "Recommendations generated and stored successfully for new video",
                "video_id": video_id,
                "recommended_videos": len(recommendations),
                "recommended_ids": [str(rec_id) for rec_id in recommendations],
                "timestamp": datetime.utcnow().isoformat()
            }), 200
        else:
            return jsonify({"error": "Failed to save recommendations"}), 500

    except Exception as e:
        logger.error(f"Error generating recommendations for new video {video_id}: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)