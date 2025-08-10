import { Playlist } from "../models/playlist.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if ([name, description].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "Name and description are required");
  }

  const playlist = await Playlist.create({
    name,
    description,
    video: [],
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist created"));
});

//Get playlist for the current user
const getUserPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find({ owner: req.user._id })
    .populate({
      path: "video",
      populate: { path: "owner", select: "_id username avatar fullName" },
    })
    .populate("owner", "_id username avatar fullName email");
  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "User playlists"));
});

const getPlaylistByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;

  // Find the user by username first
  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }

  // Now find playlists by user._id
  const playlists = await Playlist.find({ owner: user._id })
    .populate({
      path: "video",
      populate: { path: "owner", select: "_id username avatar fullName" },
    })
    .populate("owner", "_id username avatar fullName email");

  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "Playlists by username"));
});

const getPlayListById = asyncHandler(async (req, res) => {
  const playlist = req.playlist;

  // We need to populate the owner and video Fields
  await playlist.populate([
    { path: "owner", select: "_id username avatar fullName email" },
    {
      path: "video",
      populate: { path: "owner", select: "_id username avatar fullName" },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const video = req.video;
  const playlist = req.playlist;

  const videoExists = playlist.video.some(
    (id) => id.toString() === video._id.toString()
  );

  if (videoExists) {
    throw new ApiError(400, "Video already exists in playlist");
  }

  playlist.video.push(video._id);
  await playlist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video added to playlist"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const video = req.video;
  const playlist = req.playlist;

  const videoExists = playlist.video.some(
    (id) => id.toString() === video._id.toString()
  );

  if (!videoExists) {
    throw new ApiError(400, "Video not in playlist");
  }

  playlist.video = playlist.video.filter(
    (id) => id.toString() !== video._id.toString()
  );

  await playlist.save();

  return res.status(200).json(new ApiResponse(200, playlist, "Video removed"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  await Playlist.deleteOne({ _id: req.playlist._id });
  return res.status(200).json(new ApiResponse(200, {}, "Playlist deleted"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const playlist = req.playlist;

  if ([name, description].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "Name and description are required");
  }

  playlist.name = name;
  playlist.description = description;
  await playlist.save();
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlayListById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
  getPlaylistByUsername,
};
