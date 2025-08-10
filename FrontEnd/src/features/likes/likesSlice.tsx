import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LikesService } from "../../services/LikeService";

export const toggleVideoLike = createAsyncThunk(
  "likes/toggleVideoLike",
  async (videoId: string, { rejectWithValue }) => {
    try {
      if (!videoId) {
        return rejectWithValue("Video ID is required to toggle like");
      }
      const res = await LikesService.toggleVideoLike(videoId);

      if (res.success) {
        return { isCurrentVideoLiked: res.data.likeStatus };
      }
      return rejectWithValue(res.message);
    } catch (error: any) {
      console.error("Error toggling video like:", error);
      return rejectWithValue(
        error.response?.data.message || "Something went wrong"
      );
    }
  }
);

// Add this new thunk
export const checkVideoLikeStatus = createAsyncThunk(
  "likes/checkVideoLikeStatus",
  async (videoId: string, { rejectWithValue }) => {
    try {
      if (!videoId) {
        return rejectWithValue("Video ID is required to check like status");
      }
      const res = await LikesService.getVideoLikeStatus(videoId);

      if (res.success) {
        return { isCurrentVideoLiked: res.data.isLiked };
      }
      return rejectWithValue(res.message);
    } catch (error: any) {
      console.error("Error checking video like status:", error);
      return rejectWithValue(
        error.response?.data.message || "Something went wrong"
      );
    }
  }
);

// Toggle Comment Like
export const toggleCommentLike = createAsyncThunk(
  "likes/toggleCommentLike",
  async (commentId: string, { rejectWithValue }) => {
    try {
      if (!commentId) {
        return rejectWithValue("Comment ID is required to toggle like");
      }
      const res = await LikesService.toggleCommentLike(commentId);

      if (res.success) {
        return {
          commentId,
          isLiked: res.data.likeStatus,
          likesCount: res.data.likesCount || 0,
        };
      }
      return rejectWithValue(res.message);
    } catch (error: any) {
      console.error("Error toggling comment like:", error);
      return rejectWithValue(
        error.response?.data.message || "Something went wrong"
      );
    }
  }
);

// Check Comment Like Status
export const checkCommentLikeStatus = createAsyncThunk(
  "likes/checkCommentLikeStatus",
  async (commentId: string, { rejectWithValue }) => {
    try {
      if (!commentId) {
        return rejectWithValue("Comment ID is required to check like status");
      }
      const res = await LikesService.getCommentLikeStatus(commentId);

      if (res.success) {
        return {
          commentId,
          isLiked: res.data.isLiked,
          likesCount: res.data.likesCount || 0,
        };
      }
      return rejectWithValue(res.message);
    } catch (error: any) {
      console.error("Error checking comment like status:", error);
      return rejectWithValue(
        error.response?.data.message || "Something went wrong"
      );
    }
  }
);

// Get Liked Videos
export const getLikedVideos = createAsyncThunk(
  "likes/getLikedVideos",
  async (_, { rejectWithValue }) => {
    try {
      const res = await LikesService.getLikedVideos();

      if (res.success) {
        return res.data;
      }
      return rejectWithValue(res.message);
    } catch (error: any) {
      console.error("Error fetching liked videos:", error);
      return rejectWithValue(
        error.response?.data.message || "Something went wrong"
      );
    }
  }
);

// Shape returned by backend for liked videos: each entry is a like document containing embedded video info
export interface LikedVideoEntry {
  _id: string;
  video?: any; // video object with _id, title, thumbnail, views, owner {...}
  likedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface LikesState {
  isCurrentVideoLiked: boolean;
  likedVideos: LikedVideoEntry[];
  isLoading: boolean;
  error: string | null;
  commentLikes: { [commentId: string]: boolean };
  commentLikeCounts: { [commentId: string]: number };
}

// Initial state for likes
const initialState: LikesState = {
  isCurrentVideoLiked: false,
  likedVideos: [],
  isLoading: false,
  error: null,
  commentLikes: {},
  commentLikeCounts: {},
};

const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    clearLikesError: (state) => {
      state.error = null;
    },
    clearCommentLikes: (state) => {
      state.commentLikes = {};
      state.commentLikeCounts = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleVideoLike.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleVideoLike.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCurrentVideoLiked = action.payload.isCurrentVideoLiked; // Toggle the like status
      })
      .addCase(toggleVideoLike.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string; // Set the error message
      })
      // Handle the new checkVideoLikeStatus thunk
      .addCase(checkVideoLikeStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkVideoLikeStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isCurrentVideoLiked = action.payload.isCurrentVideoLiked;
      })
      .addCase(checkVideoLikeStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Comment like cases
      .addCase(toggleCommentLike.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        state.isLoading = false;
        const { commentId, isLiked, likesCount } = action.payload;
        state.commentLikes[commentId] = isLiked;
        state.commentLikeCounts[commentId] = likesCount;
      })
      .addCase(toggleCommentLike.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(checkCommentLikeStatus.fulfilled, (state, action) => {
        const { commentId, isLiked, likesCount } = action.payload;
        state.commentLikes[commentId] = isLiked;
        state.commentLikeCounts[commentId] = likesCount;
      })
      .addCase(checkCommentLikeStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getLikedVideos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLikedVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.likedVideos = action.payload;
      })
      .addCase(getLikedVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearLikesError, clearCommentLikes } = likesSlice.actions;

export default likesSlice.reducer;
