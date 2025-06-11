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

interface LikesState {
  isCurrentVideoLiked: boolean; // Indicates if the current video is liked
  isLoading: boolean; // Loading state for like actions
  error: string | null; // Error message if any
  commentLikes: { [commentId: string]: boolean }; // Track comment likes
  commentLikeCounts: { [commentId: string]: number }; // Track comment like counts
}

// Initial state for likes
const initialState: LikesState = {
  isCurrentVideoLiked: false,
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
      });
  },
});

export const { clearLikesError, clearCommentLikes } = likesSlice.actions;

export default likesSlice.reducer;
