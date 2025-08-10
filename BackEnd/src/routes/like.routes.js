import { Router } from "express";
import {
  getLikedVideos,
  toggleCommentLikes,
  toggleTweetLikes,
  toggleVideoLikes,
  getVideoLikeStatus,
  getCommentLikeStatus, // Import the new function
} from "../controllers/like.controller.js";
import { verifiedVideo } from "../middlewares/video.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifiedComment } from "../middlewares/comment.middleware.js";
import { verifiedTweet } from "../middlewares/tweet.middleware.js";

const router = Router();

// Route to get all videos liked by the user
router
  .route("/video/liked")
  .get(verifyJWT, getLikedVideos);

// Route to like/unlike a specific video
router
  .route("/video/like/:videoId")
  .post(verifyJWT, verifiedVideo, toggleVideoLikes);

router
  .route("/comment/like/:commentId")
  .post(verifyJWT, verifiedComment, toggleCommentLikes);

router
  .route("/tweet/like/:tweetId")
  .post(verifyJWT, verifiedTweet, toggleTweetLikes);

// Add new route for like status
router
  .route("/video/like-status/:videoId")
  .get(verifyJWT, verifiedVideo, getVideoLikeStatus);

router
  .route("/comment/like-status/:commentId")
  .get(verifyJWT, verifiedComment, getCommentLikeStatus);

export default router;
