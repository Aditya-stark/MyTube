import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getVideoComments = asyncHandler(async (req, res) => {
  try {
    // Get VideoId from req.params
    // Get the page , limit , sortBy and sortType from the request
    // Convert the page and limit to numbers
    // Validate the page and limit
    // Find all Comments by the videoId by aggregation pipeline
    // Match video (id in "Comment") to the "Video" collection
    // Sort and limit comments count
    // Lookup comment owner details from "User" collection
    // Project feilds we only need
    // Count total comments count for pagination
    // Get VideoId from req.params

    const { videoId } = req.params;
    const { limit = 8, lastCommentId } = req.query;

    const parsedLimit = parseInt(limit, 10);

    // Find all comments of the video using aggreation pipeline
    const result = await Comment.aggregate([
      // Match video (id in "Comment") to the "Video" collection
      {
        $match: {
          video: mongoose.Types.ObjectId.createFromHexString(videoId),
          ...(lastCommentId && {
            _id: {
              $lt: mongoose.Types.ObjectId.createFromHexString(lastCommentId),
            },
          }),
        },
      },
      {
        $facet: {
          comments: [
            // Sort comments by createdAt in descending order
            {
              $sort: {
                createdAt: -1,
              },
            },
            //Limit comments count
            {
              $limit: parsedLimit + 1,
            },
            //Lookup comment owner details from "User" collection
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

            //HERE WE CAN ADD COMMENT LINK COUNT AND FETCH COMMENT--> COMMENTS DATA (AGGERGATION) (COMPLEX THING🥲)

            // Project feilds we only need
            {
              $project: {
                commentContent: 1,
                createdAt: 1,
                updatedAt: 1,
                ownerDetails: {
                  _id: 1,
                  name: 1,
                  email: 1,
                },
              },
            },
          ],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    //Extract results from the facet operation
    let comments = result[0].comments || [];
    let hasMore = false;
    if (comments.length > parsedLimit) {
      comments = comments.slice(0, parsedLimit);
      hasMore = true;
    }
    const totalComments = result[0].totalCount[0]?.count || 0;

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          comments,
          totalComments,
          hasMore,
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
