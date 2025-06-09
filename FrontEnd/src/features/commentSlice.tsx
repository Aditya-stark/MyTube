import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import commentService from "../services/CommentService";
import { Comment } from "../types/CommentType";
import { access } from "fs";

export const addComment = createAsyncThunk(
  "comments/addComment",
  async (
    { videoId, commentData }: { videoId: string; commentData: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await commentService.addComment(videoId, commentData);
      if (res.success) {
        return res.data;
      }
      throw rejectWithValue(res.message);
    } catch (error: any) {
      console.error("Error adding comment:", error);
      return rejectWithValue(
        error.response?.data.message || "Something went wrong"
      );
    }
  }
);

// For initial comments
export const getComments = createAsyncThunk(
  "comments/getInitialComments",
  async (videoId: string, { rejectWithValue }) => {
    try {
      const res = await commentService.getComments(videoId);
      if (res.success) {
        return res.data;
      }
      return rejectWithValue(res.message);
    } catch (error: any) {
      console.error("Error fetching initial comments:", error);
      return rejectWithValue(
        error.response?.data.message || "Something went wrong"
      );
    }
  }
);

// For loading more comments
export const getMoreComments = createAsyncThunk(
  "comments/getMoreComments",
  async (
    { videoId, lastCommentId }: { videoId: string; lastCommentId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await commentService.getComments(videoId, lastCommentId);
      if (res.success) {
        return res.data;
      }
      return rejectWithValue(res.message);
    } catch (error: any) {
      console.error("Error fetching more comments:", error);
      return rejectWithValue(
        error.response?.data.message || "Something went wrong"
      );
    }
  }
);

// Edit comment action
export const editComment = createAsyncThunk(
  "comments/editComment",
  async (
    {
      editCommentId,
      editComment,
    }: { editCommentId: string; editComment: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await commentService.editComment(editCommentId, editComment);
      if (res.success) {
        return res.data;
      }
      return rejectWithValue(res.message);
    } catch (error: any) {
      console.error("Error editing comment:", error);
      return rejectWithValue(
        error.response?.data.message || "Something went wrong"
      );
    }
  }
);

// Delete comment action
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId: string, { rejectWithValue }) => {
    try {
      const res = await commentService.deleteComment(commentId);
      if (res.success) {
        return {
          ...res,
          deletedCommentId: commentId,
        };
      }
      return rejectWithValue(res.message);
    } catch (error: any) {
      console.error("Error deleting comment:", error);
      return rejectWithValue(
        error.response?.data.message || "Something went wrong"
      );
    }
  }
);

interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalComments: number;
  addingComment: boolean;
  deletingComment: boolean;
  isLoadingMore: boolean;
  lastCommentId?: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
  hasMore: false,
  totalComments: 0,
  addingComment: false,
  deletingComment: false,
  isLoadingMore: false,
  lastCommentId: null,
};

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearCommentsError: (state) => {
      state.error = null;
    },
    clearComments: (state) => {
      state.comments = [];
      state.hasMore = false;
      state.totalComments = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.addingComment = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state) => {
        state.loading = false;
        state.addingComment = false;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.addingComment = false;
        state.error = action.payload as string;
      })
      .addCase(getComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.comments;
        state.hasMore = action.payload.hasMore;
        state.totalComments = action.payload.totalComments;
        state.lastCommentId = action.payload.lastCommentId || null;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getMoreComments.pending, (state) => {
        state.isLoadingMore = true;
        state.error = null;
      })
      .addCase(getMoreComments.fulfilled, (state, action) => {
        state.isLoadingMore = false;

        if (action.payload.comments.length > 0) {
          // Get existing comment IDs to prevent duplicates
          const existingIds = new Set(
            state.comments.map((comment: Comment) => comment._id)
          );

          // Filter out any comments that already exist
          const newComments = action.payload.comments.filter(
            (comment: Comment) => !existingIds.has(comment._id)
          );

          // Only add new comments
          if (newComments.length > 0) {
            state.comments.push(...newComments);
          }

          state.hasMore = action.payload.hasMore;
          state.lastCommentId = action.payload.lastCommentId || null;
        }
      })
      .addCase(getMoreComments.rejected, (state, action) => {
        state.isLoadingMore = false;
        state.error = action.payload as string;
      })
      .addCase(editComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editComment.fulfilled, (state, action) => {
        state.loading = false;
        const updatedComment = action.payload;
        const index = state.comments.findIndex(
          (comment) => comment._id === updatedComment._id
        );
        if (index !== -1) {
          state.comments[index].commentContent = updatedComment.commentContent;
        }
      })
      .addCase(editComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteComment.pending, (state) => {
        state.deletingComment = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.deletingComment = false;
        const deletedCommentId = action.payload.deletedCommentId;
        state.comments = state.comments.filter(
          (comment) => comment._id !== deletedCommentId
        );
        state.totalComments -= 1;
        if (state.comments.length === 0) {
          state.hasMore = false;
          state.lastCommentId = null;
        }
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.deletingComment = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCommentsError, clearComments } = commentSlice.actions;
export default commentSlice.reducer;
