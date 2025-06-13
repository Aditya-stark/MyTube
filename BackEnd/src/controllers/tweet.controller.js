import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createTweet = asyncHandler(async (req, res) => {
  try {
    // Get tweet content from req
    // Verify the content is not empty and less than 280 characters
    // Verify the user is logged in
    // Create a new tweet
    // Save the tweet
    // Send the tweet as response

    const { content } = req.body;
    // Verify the content is not empty and less than 280 characters
    if (!content || content.trim() === "" || content.length > 280) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "Tweet content is required and should be less than 280 characters"
          )
        );
    }

    const tweet = await Tweet.create({
      content,
      owner: req.user._id,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, tweet, "Tweet created successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Error while creating tweet"));
  }
});

//Get a Particular tweet by tweetId
const getParticularTweet = asyncHandler(async (req, res) => {
  try {
    const tweet = req.tweet;
    await tweet.populate("owner", "username avatar");

    return res
      .status(200)
      .json(new ApiResponse(200, tweet, "Tweet fetched successfully"));
  } catch (error) {
    return res
      .status(400)
      .json(new ApiError(400, "Error while get tweet" + error.message));
  }
});

// Get all tweets of a user with pagination
const getUserTweets = asyncHandler(async (req, res) => {
  try {
    const { limit = 4, lastTweetId } = req.query;
    const userId = req.user?._id.toString();
    console.log("User ID:", userId);
    
    const parsedLimit = parseInt(limit) || 10;

    // Find all tweets of the user using aggregation pipeline
    const tweets = await Tweet.aggregate([
      // Match the owner (user) in tweet collection
      {
        $match: {
          owner: mongoose.Types.ObjectId.createFromHexString(userId),
          ...(lastTweetId
            ? {
                _id: {
                  $lt: mongoose.Types.ObjectId.createFromHexString(lastTweetId),
                },
              }
            : {}),
        },
      },
      // Sort by creation date (newest first)
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: parsedLimit + 1,
      },
      // Lookup owner details
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
      // Lookup all likes for this tweet (needed for isLiked check)
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "tweet",
          as: "likes",
        },
      },
      // Lookup likes count using pipeline
      {
        $lookup: {
          from: "likes",
          let: { tweetId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$tweet", "$$tweetId"] },
              },
            },
            {
              $count: "count",
            },
          ],
          as: "likesCount",
        },
      },

      // Project only fields we need
      {
        $project: {
          content: 1,
          createdAt: 1,
          updatedAt: 1,
          owner: {
            _id: "$ownerDetails._id",
            username: "$ownerDetails.username",
            avatar: "$ownerDetails.avatar",
          },
          likesCount: {
            $cond: {
              if: { $gt: [{ $size: "$likesCount" }, 0] },
              then: { $arrayElemAt: ["$likesCount.count", 0] },
              else: 0,
            },
          },
          isLiked: userId
            ? {
                $in: [
                  mongoose.Types.ObjectId.createFromHexString(userId),
                  "$likes.likedBy",
                ],
              }
            : false,
        },
      },
    ]);

    // Count total tweets for pagination info
    const totalTweets = await Tweet.countDocuments({ 
      owner: mongoose.Types.ObjectId.createFromHexString(userId) 
    });

    let hasMore = false;
    if (tweets.length > parsedLimit) {
      tweets.pop(); // Remove the extra tweet
      hasMore = true; // Indicate that there are more tweets
    }
    const lastTwetId = tweets.length > 0 ? tweets[tweets.length - 1]._id : null;

    // Return the tweets
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          tweets,
          totalTweets,
          hasMore,
          lastTweetId : lastTwetId,
        },
        "User tweets fetched successfully"
      )
    );
  } catch (error) {
    console.log("Error fetching user tweets", error);
    return res
      .status(500)
      .json(new ApiError(500, "Error while fetching the tweets")); // Fixed typo: fecthing -> fetching
  }
});

const updateTweet = asyncHandler(async (req, res) => {
  // Get content from the req
  const { content } = req.body;
  const tweet = req.tweet;

  //Validate the content
  if (!content || content.trim() === "" || content.length > 280) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "Tweet content is required and should be less than 280 characters"
        )
      );
  }
  //update tweet
  tweet.content = content;
  tweet.updatedAt = Date.now();
  await tweet.save();
  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  await req.tweet.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Tweet deleted successfully"));
});

export {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
  getParticularTweet,
};
