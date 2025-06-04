import { Router } from "express";
import {
  getLikedVideos,
  toggleCommentLikes,
  toggleTweetLikes,
  toggleVideoLikes,
  getVideoLikeStatus, // <-- Import the new controller function
} from "../controllers/like.controller.js";
import { verifiedVideo } from "../middlewares/video.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifiedComment } from "../middlewares/comment.middleware.js";
import { verifiedTweet } from "../middlewares/tweet.middleware.js";

const router = Router();

router
  .route("/video/like/:videoId")
  .get(verifyJWT, verifiedVideo, getLikedVideos)
  .post(verifyJWT, verifiedVideo, toggleVideoLikes);
router
  .route("/comment/like/:commentId")
  .post(verifyJWT, verifiedComment, toggleCommentLikes);
router
  .route("/tweet/like/:tweetId")
  .post(verifyJWT, verifiedTweet, toggleTweetLikes);
router
  .route("/video/like-status/:videoId")
  .get(verifyJWT, verifiedVideo, getVideoLikeStatus);

export default router;
