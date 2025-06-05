import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import commentService from "../services/CommentService";
import { Comment } from "../types/CommentType";

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

interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalComments: number;
  addingComment: boolean;
  deletingComment: boolean;
  isLoadingMore: boolean;
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
      });
  },
});

export const { clearCommentsError, clearComments } = commentSlice.actions;
export default commentSlice.reducer;
