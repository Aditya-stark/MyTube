import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getAllVideosByUserId,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updatedVideo,
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifiedVideo } from "../middlewares/video.middleware.js";

const router = Router();

//Get Videos according to the search query
router.route("/getVideos").get(getAllVideos);

//Get All Videos of the user
router.route("/user-videos").get(verifyJWT, getAllVideosByUserId);

//Publish a video
router.route("/publish").post(
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  verifyJWT,
  publishAVideo
);
//Get Video by Id
router.route("/:videoId").get(getVideoById);

//Update Video
router
  .route("/update/:videoId")
  .patch(upload.single("thumbnail"), verifyJWT, verifiedVideo, updatedVideo);

//Delete Video
router.route("/delete/:videoId").delete(verifyJWT, verifiedVideo, deleteVideo);

//Toggle Publish Status
router
  .route("/publish/:videoId")
  .patch(verifiedVideo, verifyJWT, togglePublishStatus);

export default router;
