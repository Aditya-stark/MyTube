import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PaginatedVideos, Video } from "../../types/VideoType";
import VideoService from "../../services/VideoService";

export const publishVideo = createAsyncThunk(
  "videos/publish",
  async (videoData: FormData, { rejectWithValue }) => {
    try {
      const res = await VideoService.publishVideo(videoData);
      console.log("Publish video response VIDEOSLICE:", res);
      if (res.success) {
        return res.data;
      }
      throw rejectWithValue(res.message);
    } catch (error: any) {
      console.error("Error publishing video:", error);
      return rejectWithValue(
        error.response?.data.message || "Something went wrong"
      );
    }
  }
);

export const getUserVideos = createAsyncThunk(
  "videos/getUserVideos",
  async (_, { rejectWithValue }) => {
    try {
      const res = await VideoService.getUserVideos();
      console.log("Get user videos response VIDEOSLICE:", res);
      if (res.success) {
        return res.data;
      }
      throw rejectWithValue(res.message);
    } catch (error: any) {
      console.error("Error fectching user videos:", error);
      return rejectWithValue(
        error.response?.data.message || "Something went wrong"
      );
    }
  }
);

interface VideoState {
  videos: PaginatedVideos | null;
  currentVideo: Video | null;
  isLoading: boolean;
  error: string | null;
  isPublishing: boolean;
  isPublished: boolean;
}

const initialState: VideoState = {
  videos: null,
  currentVideo: null,
  isLoading: false,
  error: null,
  isPublishing: false,
  isPublished: false,
};

const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    clearVideoError: (state) => {
      state.error = null;
    },
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
    },
    resetPublishState: (state) => {
      state.isPublished = false;
      state.isPublishing = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(publishVideo.pending, (state) => {
        state.isPublishing = true;
        state.error = null;
      })
      .addCase(publishVideo.fulfilled, (state, action) => {
        state.isPublished = true;
        state.isPublishing = false;
        state.currentVideo = action.payload;
      })
      .addCase(publishVideo.rejected, (state, action) => {
        state.isPublishing = false;
        state.error = action.payload as string;
      })
      .addCase(getUserVideos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.videos = action.payload;
        console.log("Videos API Structure:", action.payload);
      })
      .addCase(getUserVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.videos = null;
      });
  },
});

export const { clearVideoError, clearCurrentVideo, resetPublishState } =
  videoSlice.actions;
export default videoSlice.reducer;
