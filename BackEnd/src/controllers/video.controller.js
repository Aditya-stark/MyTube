import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  deleteOldFileCloundinary,
  uploadOnCloudinary,
  uploadThumbnailToCloudinary,
} from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";

const getAllVideos = asyncHandler(async (req, res) => {
  // Extract query parameters from the request (page, limit, query, sortBy, sortType, userId)
  // Convert page and limit to numbers and ensure they have valid values
  // Validate and sanitize the query parameters
  // Build a search filter object based on the query (e.g., title, description, tags, etc.)
  // If userId is provided, filter videos uploaded by the specific user
  // Construct sorting options based on sortBy and sortType (e.g., newest first, most viewed, etc.)
  // Fetch videos from the database with applied filters, pagination, and sorting
  // Populate necessary fields if references exist (e.g., user details, comments, etc.)
  // Handle cases where no videos are found and return an appropriate response
  // Return the paginated list of videos along with metadata (total count, current page, total pages)
  // Handle any errors and send an appropriate error response

  // Extract query parameters from the request (page, limit, query, sortBy, sortType, userId)
  const {
    page = 1,
    limit = 10,
    query,
    sortBy,
    sortType,
    userId = "NA",
  } = req.query;

  // Convert page and limit to numbers and ensure they have valid values
  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);

  // Validate and sanitize the query parameters
  if (
    isNaN(parsedPage) ||
    isNaN(parsedLimit) ||
    parsedPage < 1 ||
    parsedLimit < 1
  ) {
    return res.status(400).json(new ApiError(400, "Invalid page or limit"));
  }
  // Validating sortBy and sortType
  if (sortBy && !["latest", "oldest", "most-viewed"].includes(sortBy)) {
    return res.status(400).json(new ApiError(400, "Invalid sortBy value"));
  }
  if (sortType && !["asc", "desc"].includes(sortType)) {
    return res.status(400).json(new ApiError(400, "Invalid sortType value"));
  }

  // Build a search filter object based on the query (e.g., title, description, tags, etc.)
  let searchFilter = {};
  if (query) {
    searchFilter.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  if (userId && userId !== "NA") {
    // Check if userId is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(userId)) {
      searchFilter.owner = new mongoose.Types.ObjectId(userId);
    } else {
      // If invalid userId, return no results or an error
      throw new ApiError(400, "Invalid user ID format");
    }
  }

  // Construct sorting options based on sortBy and sortType (latest, older, most-viewed, and asc, des etc.)
  // 1 (Ascending): Sorts values from smallest to largest
  //   For text: A → Z (alphabetical order)
  //   For numbers: 1 → 999 (smallest to largest)
  //   For dates: oldest → newest (earliest to latest)

  // -1 (Descending): Sorts values from largest to smallest
  //   For text: Z → A (reverse alphabetical order)
  //   For numbers: 999 → 1 (largest to smallest)
  //   For dates: newest → oldest (latest to earliest)

  let sort = {};
  if (sortBy === "latest") {
    sort.createdAt = sortType === "asc" ? 1 : -1;
  } else if (sortBy === "oldest") {
    sort.createdAt = sortType === "desc" ? -1 : 1;
  } else if (sortBy === "most-viewed") {
    sort.views = -1;
  } else {
    sort.createdAt = -1; //default latest first
  }

  // Fetch videos from the database with applied filters, pagination and sorting
  // const videos = await Video.aggregatePaginate(
  //   Video.find(searchFilter).sort(sort),
  //   {
  //     page: parsedPage,
  //     limit: parseLimit,
  //     populate: { path: "owner", select: "username avatar" },
  //   }
  // );

  const aggregateQuery = Video.aggregate([
    { $match: searchFilter },
    { $sort: sort },
  ]);

  const videos = await Video.aggregatePaginate(aggregateQuery, {
    page: parsedPage,
    limit: parsedLimit,
    populate: { path: "owner", select: "username avatar" },
  });

  // Handle cases where no videos are found and return an appropriate response
  if (!videos) {
    return res.status(404).json(new ApiError(404, "No videos found"));
  }

  // Return the paginated list of videos along with metadata (total count, current page, total pages)
  res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos Fetched Successfully"));
});

// Get all videos by userId
const getAllVideosByUserId = asyncHandler(async (req, res) => {
  // Get username from either params or query
  const usernameFromParams = req.params.username;
  const username = usernameFromParams;

  // Check if username is provided
  if (!username) {
    return res
      .status(400)
      .json(new ApiError(400, "Username is required to fetch videos"));
  }

  // Find user by username
  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }

  const userId = user._id;

  // Get the page , limit , sortBy and sortType from the request
  const { limit = 8, lastVideoId, sortBy, sortType } = req.query;
  const parsedLimit = parseInt(limit, 10);

  // Validate the page and limit
  if (isNaN(parsedLimit) || parsedLimit < 1) {
    return res.status(400).json(new ApiError(400, "Invalid Limit"));
  }

  // Validate the sortBy and SortType
  if (sortBy && !["latest", "oldest", "most-viewed"].includes(sortBy)) {
    return res.status(400).json(new ApiError(400, "Invalid sortBy value"));
  }

  if (sortType && !["asc", "desc"].includes(sortType)) {
    return res.status(400).json(new ApiError(400, "Invalid sortType value"));
  }

  // Find all videos by the userId
  const searchFilter = { owner: userId };

  // Add condition if lastVideoId is provided
  if (lastVideoId) {
    try {
      const lastVideo = await Video.findById(lastVideoId);
      if (!lastVideo) {
        return res.status(400).json(new ApiError(400, "Invalid lastVideoId"));
      }

      // Adjust cursor condition based on sort order
      if (sortBy === "oldest" && (!sortType || sortType === "asc")) {
        searchFilter.createdAt = { $gt: lastVideo.createdAt }; // For oldest (ascending), get newer dates
      } else if (sortBy === "most-viewed") {
        // Correct compound cursor for most-viewed (descending)
        searchFilter.$or = [
          { views: { $lt: lastVideo.views } },
          { views: lastVideo.views, _id: { $lt: lastVideo._id } },
        ];
      } else {
        searchFilter.createdAt = { $lt: lastVideo.createdAt }; // Default (descending), get older dates
      }
    } catch (error) {
      return res.status(400).json(new ApiError(400, "Invalid lastVideoId"));
    }
  }

  // Construct sorting options based on sortBy and sortType
  let sort = {};
  if (sortBy === "latest") {
    sort.createdAt = sortType === "asc" ? 1 : -1;
  } else if (sortBy === "oldest") {
    sort.createdAt = sortType === "desc" ? -1 : 1;
  } else if (sortBy === "most-viewed") {
    sort = { views: -1, _id: -1 }; // Always use compound sort for most-viewed
  } else {
    sort.createdAt = -1; //default latest first
  }
  // Fetch videos from the database with applied filters, pagination and sorting
  const videos = await Video.find(searchFilter)
    .sort(sort)
    .limit(parsedLimit + 1) // Fetch one extra to check for more
    .populate("owner", "username avatar fullName");

  // Check if there are more videos available
  const hasMoreVideos = videos.length > parsedLimit;
  const videosToReturn = hasMoreVideos ? videos.slice(0, parsedLimit) : videos;

  // Return the videos with accurate flags
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos: videosToReturn,
        hasMoreVideos,
        lastVideoId:
          videosToReturn.length > 0
            ? videosToReturn[videosToReturn.length - 1]._id
            : null,
      },
      "Videos fetched successfully"
    )
  );
});

// Publish a video
const publishAVideo = asyncHandler(async (req, res) => {
  // Get information from the req.body
  // Get Video and thumbnail file
  // Validate information not empty
  // upload to cloudinary
  // create a video document in the database
  // add all information to the video document
  // return the video document

  // Get information from the req.body
  const { title, description, isPublished } = req.body;
  if ([title, description].some((field) => field?.trim() === "")) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  // Get Video and thumbnail
  const videoLocalPath = req.files?.video[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "Video and thumbnail files are required");
  }

  // Upload to cloundinary
  const videoCloudinary = await uploadOnCloudinary(videoLocalPath);
  console.log("Video Cloudinary:", videoCloudinary);
  const thumbnailCloudinary =
    await uploadThumbnailToCloudinary(thumbnailLocalPath);

  console.log("Thumbnail Cloudinary:", thumbnailCloudinary);

  // create a video document in the database
  const video = await Video.create({
    videoFile: videoCloudinary.url,
    thumbnail: thumbnailCloudinary.url,
    title,
    description,
    duration: videoCloudinary.duration,
    owner: req.user._id,
    views: 0,
    isPublished,
    localVideoData: videoCloudinary,
  });

  //Return the video document
  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video Published succesfully"));
});

// Get Video by Id
const getVideoById = asyncHandler(async (req, res) => {
  try {
    // Get the videoId from the request parameters
    // Find the video with the given videoId with Aggregation pipeline
    // Match the video by ID
    // Lookup to populate the owner field
    // Lookup to get subscriber count for the owner
    // Add subscriber count to ownerDetails
    // Lookup to get likes count
    // Add likes count to the video
    // Project the necessary fields to return
    // If the video is not found, return an error response
    // Increment the view count of the video in the database
    // Return the video details along with the owner details

    // Get the videoId from the request parameters
    const { videoId } = req.params;

    // Find the video with the given videoId with Aggregation pipeline
    const videoDataArr = await Video.aggregate([
      // Match the video by ID
      { $match: { _id: new mongoose.Types.ObjectId(videoId) } },
      // Lookup to populate the owner field
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerDetails",
        },
      },
      { $unwind: "$ownerDetails" },
      // Lookup to get subscriber count for the owner
      {
        $lookup: {
          from: "subscribers",
          localField: "owner",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $addFields: {
          "ownerDetails.subscriberCount": { $size: "$subscribers" },
        },
      },
      // Lookup to get likes count
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "video",
          as: "likes",
        },
      },
      {
        $addFields: {
          likesCount: { $size: "$likes" },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          views: 1,
          description: 1,
          videoFile: 1,
          thumbnail: 1,
          duration: 1,
          isPublished: 1,
          createdAt: 1,
          updatedAt: 1,
          ownerDetails: {
            _id: 1,
            fullName: 1,
            avatar: 1,
            subscriberCount: 1,
          },
          likesCount: 1,
        },
      },
    ]);
    const videoData = videoDataArr[0];

    // If the video is not found, return an error response
    if (!videoData) {
      return res.status(404).json(new ApiError(404, "Video not found"));
    }
    // Increment the view count of the video in the database
    await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });

    // Return the video details along with the owner details
    return res.status(200).json(new ApiResponse(200, videoData, "Video Found"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
});

//Updated the video
const updatedVideo = asyncHandler(async (req, res) => {
  // Get the updated information from the req.body
  // Get the thumbnail from the req.file
  // Get Video from verifiedVideo middleware
  // Check if the user is the owner of the video
  // Upload the thumbnail to cloudinary
  // Delete the old thumbnail from cloudinary
  // Update the video with the new information
  // Return the updated video

  // Get the updated information from the req.body
  const video = req.video;
  const { title, description, isPublished } = req.body;
  // Get the thumbnail from the req.file
  const thumbnailLocalPath = req.file?.path;

  if ([title, description].some((field) => field?.trim() === "")) {
    console.log("Error1");

    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  // If thumbnail is not provided, skip updating thumbnail
  let thumbnailUrl = video.thumbnail;
  if (thumbnailLocalPath) {
    // Upload the thumbnail to cloudinary
    const thumbnail = await uploadThumbnailToCloudinary(thumbnailLocalPath);
    if (!thumbnail.url) {
      return res
        .status(500)
        .json(new ApiError(500, "Error uploading thumbnail"));
    }
    // Delete the old thumbnail from cloudinary
    await deleteOldFileCloundinary(video.thumbnail);
    thumbnailUrl = thumbnail.url;
  }

  // Get Video from verifiedVideo middleware

  // Check if the user is the owner of the video
  if (video.owner.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json(new ApiError(403, "You are not allowed to update this video"));
  }

  // Update the video with the new information
  video.title = title;
  video.description = description;
  if (thumbnailUrl) {
    video.thumbnail = thumbnailUrl;
  }
  if (isPublished === "true") {
    video.isPublished = true;
  } else if (isPublished === "false") {
    video.isPublished = false;
  }
  await video.save();

  // Return the updated video
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video Updated Successfully"));
});

// Delete Video by Id
const deleteVideo = asyncHandler(async (req, res) => {
  // Get the videoId from the request parameters
  // Find the video with the given videoId
  // If the video is not found, return an error response
  // Check if the user is the owner of the video
  // Delete the video from the database
  // Delete the video file and thumbnail from cloudinary
  // Return a success response

  try {
    // Get the videoId from the request parameter
    const { videoId } = req.params;

    // Find the video with the given videoId
    const video = await Video.findById(videoId);

    // If the video is not found, return an error response
    if (!video) {
      console.log("Video does not exist");

      return res.status(400).json(new ApiError(400, "Video does not exist"));
    }

    // Check if the user is the owner of the video
    if (video.owner.toString() !== req.user._id.toString()) {
      console.log("You are not allowed to delete this video");
      return res
        .status(400)
        .json(new ApiError(403, "You are not allowed to delete this video"));
    }

    // Delete the video from the database
    await Video.findByIdAndDelete(videoId);

    // Delete the video file and thumbnail from cloudinary
    await deleteOldFileCloundinary(video.videoFile);
    await deleteOldFileCloundinary(video.thumbnail);

    // Return a success response
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video deleted successfully"));
  } catch (error) {
    console.log("Error while deleting Video:", error);
    return res.status(500).json(new ApiError(500, "Failed to delete video"));
  }
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  try {
    // Get Video Id from the params
    // Find the video with the given videoId
    // If the video is not found, return an error response
    // Check if the user is the owner of the video
    // Toggle the publish status of the video
    // Return the updated video

    // Get Video Id from the params
    const { videoId } = req.params;

    // Find the video with the given videoId
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json(new ApiError(404, "Video Not Found"));
    }
    //Check if the user is the owner of the video
    if (video.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json(new ApiError(403, "You are not allowed to update this video"));
    }
    //Toggle the publish status of the video
    video.isPublished = !video.isPublished;
    await video.save();

    //Return the updated video
    return res
      .status(200)
      .json(
        new ApiResponse(200, video, "Publised toggle changed successfully")
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Error while toggling the video status"));
  }
});

export {
  getAllVideos,
  getAllVideosByUserId,
  publishAVideo,
  getVideoById,
  updatedVideo,
  deleteVideo,
  togglePublishStatus,
};
