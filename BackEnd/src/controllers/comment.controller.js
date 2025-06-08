import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getVideoComments = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    const { limit = 4, lastCommentId } = req.query;

    console.log("Fetching comments for video:", videoId);
    console.log("lastCommentId:", lastCommentId);
    console.log("limit:", limit);

    const parsedLimit = parseInt(limit, 10);

    // Build match condition
    const matchCondition = {
      video: mongoose.Types.ObjectId.createFromHexString(videoId),
    };

    // Add pagination condition if lastCommentId is provided
    if (lastCommentId) {
      matchCondition._id = {
        $lt: mongoose.Types.ObjectId.createFromHexString(lastCommentId),
      };
    }

    // Get total comments count for this video (without pagination)
    const totalComments = await Comment.countDocuments({
      video: mongoose.Types.ObjectId.createFromHexString(videoId),
    });

    // Get comments with pagination
    const comments = await Comment.aggregate([
      {
        $match: matchCondition,
      },
      // Sort comments by createdAt in descending order
      {
        $sort: {
          createdAt: -1,
        },
      },
      // Get one extra to check if there are more comments
      {
        $limit: parsedLimit + 1,
      },
      // Lookup comment owner details from "User" collection
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerDetails",
        },
      },
      {
        $unwind: "$ownerDetails",
      },
      // Project fields we only need
      {
        $project: {
          commentContent: 1,
          createdAt: 1,
          updatedAt: 1,
          ownerDetails: {
            _id: 1,
            fullName: 1,
            email: 1,
            username: 1,
            avatar: 1,
          },
        },
      },
    ]);

    // Check if there are more comments
    let hasMore = false;
    if (comments.length > parsedLimit) {
      comments.pop(); // Remove the extra comment
      hasMore = true;
    }
    const lastCmtId =
      comments.length > 0 ? comments[comments.length - 1]._id : null;

    console.log("Returning comments count:", comments.length);
    console.log("hasMore:", hasMore);
    console.log("lastCmtId:", lastCmtId);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          comments,
          totalComments,
          hasMore,
          lastCommentId: lastCmtId,
        },
        "Comments fetched successfully"
      )
    );
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
});

const getParticularComment = asyncHandler(async (req, res) => {
  try {
    const comment = req.comment;
    await comment.populate("owner", "_id username avatar");
    return res
      .status(200)
      .json(new ApiResponse(200, comment, "Comment fetched"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Error while fetching the comment"));
  }
});

const addComment = asyncHandler(async (req, res) => {
  try {
    // Get VideoId from req.video
    // Get commentContent from req.body
    // Get userId from req.user
    // Create a new comment
    // Save the comment
    // Return the comment

    // Get VideoId from req.params
    const videoId = req.video._id;
    // Get contents from req.body
    const { commentContent } = req.body;
    console.log("Comment Content: ", commentContent);
    // Get userdId from req.user
    const ownerId = req.user._id;

    if (
      !commentContent ||
      commentContent.trim() === "" ||
      commentContent.length > 280
    ) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "Comment content is required and should be less than 280 characters"
          )
        );
    }

    const comment = await Comment.create({
      commentContent,
      video: videoId,
      owner: ownerId,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, comment, "Tweet created successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Error while commenting " + error.message));
  }
});

const updateComment = asyncHandler(async (req, res) => {
  try {
    const comment = req.comment;
    const { commentContent } = req.body;

    if (
      !commentContent ||
      commentContent.trim() === "" ||
      commentContent.length > 280
    ) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "Comment content is required and should be less than 280 characters"
          )
        );
    }

    comment.commentContent = commentContent;
    comment.updatedAt = Date.now();
    await comment.save();
    return res
      .status(200)
      .json(new ApiResponse(200, comment, "Comment updated successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Error while updating the comment"));
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  try {
    await req.comment.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Comment deleted successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Error while deleting the comment"));
  }
});

export {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
  getParticularComment,
};
