import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaginatedVideos, Video } from "../../types/VideoType";
import VideoService from "../../services/VideoService";
import { RootState } from "../../store/store";
import { SubscriptionService } from "../../services/SubscriptionService";

export const publishVideo = createAsyncThunk(
  "videos/publish",
  async (videoData: FormData, { rejectWithValue }) => {
    try {
      const res = await VideoService.publishVideo(videoData);
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

export const getVideosByUsername = createAsyncThunk(
  "videos/getUserVideos",
  async (
    { username, sortBy }: { username: string; sortBy?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await VideoService.getVideosByUsername(
        username,
        undefined,
        sortBy
      );
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

export const loadMoreUserVideos = createAsyncThunk(
  "videos/getMoreUserVideos",
  async (
    { username, sortBy }: { username: string; sortBy: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const lastVideoId = state.videos.lastVideoId;
      if (!lastVideoId) {
        return { videos: [], hasMoreVideos: false, lastVideoId: null };
      }
      // Correctly pass username (path), lastVideoId and sortBy (query)
      const res = await VideoService.getVideosByUsername(
        username,
        lastVideoId,
        sortBy
      );
      if (res.success) {
        return res.data;
      }
    } catch (error: any) {
      console.error("Error fetching more user videos:", error);
      return rejectWithValue(
        error.response?.data.message || "Something went wrong"
      );
    }
  }
);

// Watch Page
export const videoById = createAsyncThunk(
  "videos/watchVideo",
  async (videosId: string, { rejectWithValue }) => {
    try {
      const res = await VideoService.getVideoById(videosId);
      if (res.success) {
        return res.data;
      }
      throw rejectWithValue(res.message);
    } catch (error: any) {
      console.error("Error fetching video:", error);
      return rejectWithValue(
        error.response?.data.message || "Something went wrong"
      );
    }
  }
);

//Update Video
export const updateVideo = createAsyncThunk(
  "videos/updateVideo",
  async (
    { videoId, videoData }: { videoId: string; videoData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const res = await VideoService.updateVideoDetails(videoId, videoData);
      if (res.success) {
        return res.data;
      }
      return rejectWithValue(res.message);
    } catch (error: any) {
      console.error("Error updating video:", error);
      return rejectWithValue(
        error.response?.data.message || "Something went wrong"
      );
    }
  }
);

// Delete Video
export const deleteVideo = createAsyncThunk(
  "videos/deleteVideo",
  async (videoId: string, { rejectWithValue }) => {
    try {
      const res = await VideoService.deleteVideo(videoId);
      if (res.success) {
        return res.data;
      }
      return rejectWithValue(res.message);
    } catch (error: any) {
      console.error("Error deleting video:", error);
      return rejectWithValue(
        error.response?.data.message || "Something went wrong"
      );
    }
  }
);

export const getRecommendedVideos = createAsyncThunk(
  "videos/recommendedVideos",
  async (videoId: string, { rejectWithValue }) => {
    try {
      const res = await VideoService.getRecommendedVideos(videoId);
      if (res.success) {
        return res.data;
      }
      return rejectWithValue(res.message);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message || "Something went wrong"
      );
    }
  }
);

export const getSubscribedVideos = createAsyncThunk(
  "subscription/getSubscribedVideos",
  async (
    { limit, lastVideoId }: { limit: 8; lastVideoId?: string | null },
    { rejectWithValue }
  ) => {
    try {
      const res = await SubscriptionService.getSubscribedVideos(
        limit,
        lastVideoId ?? undefined
      );
      if (res.success) {
        return res.data;
      }
      return rejectWithValue(res.message || "Failed to get subscribed videos");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message || "Failed to get subscribed videos"
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
  hasMoreVideos?: boolean;
  lastVideoId?: string | null;
  isLoadingMore?: boolean;
  recommendedVideos: Video[] | null;
  isRecommendedLoading: boolean;
  recommendedError: string | null;

  subscribedVideos: Video[] | null;
  subscribedVideosLoading: boolean;
  subscribedVideosError: string | null;
  subscribedHasMore: boolean;
  subscribedLastVideoId?: string | null;
  subscribedIsLoadingMore: boolean;
}

const initialState: VideoState = {
  videos: null,
  currentVideo: null,
  isLoading: false,
  error: null,
  isPublishing: false,
  isPublished: false,
  hasMoreVideos: false,
  lastVideoId: null,
  isLoadingMore: false,
  recommendedVideos: null,
  isRecommendedLoading: false,
  recommendedError: null,

  subscribedVideos: null,
  subscribedVideosLoading: false,
  subscribedVideosError: null,
  subscribedHasMore: false,
  subscribedLastVideoId: null,
  subscribedIsLoadingMore: false,
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
    // Add a new action to update the like count
    updateVideoLikeCount: (
      state,
      action: PayloadAction<{ increment: boolean }>
    ) => {
      if (state.currentVideo) {
        state.currentVideo.likesCount += action.payload.increment ? 1 : -1;
      }
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
      .addCase(getVideosByUsername.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getVideosByUsername.fulfilled, (state, action) => {
        state.isLoading = false;
        state.videos = action.payload;
        state.hasMoreVideos = action.payload.hasMoreVideos;
        state.lastVideoId = action.payload.lastVideoId || null;
      })
      .addCase(getVideosByUsername.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.videos = null;
      })
      .addCase(loadMoreUserVideos.pending, (state) => {
        state.isLoadingMore = true;
        state.error = null;
      })
      .addCase(loadMoreUserVideos.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        if (state.videos && action.payload.videos.length > 0) {
          state.videos.videos.push(...action.payload.videos);
          state.hasMoreVideos = action.payload.hasMoreVideos;
          state.lastVideoId = action.payload.lastVideoId || null;
        }
      })
      .addCase(loadMoreUserVideos.rejected, (state, action) => {
        state.isLoadingMore = false;
        state.error = action.payload as string;
      })
      .addCase(videoById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(videoById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentVideo = action.payload;
      })
      .addCase(videoById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.currentVideo = null;
      })
      .addCase(updateVideo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentVideo = action.payload;
        state.error = null;
      })
      .addCase(updateVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        console.error("Error updating video:", action.payload);
      })
      .addCase(deleteVideo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteVideo.fulfilled, (state) => {
        state.isLoading = false;
        state.currentVideo = null; // Clear current video on successful deletion
        state.error = null;
        console.log("Video deleted successfully");
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        console.error("Error deleting video:", action.payload);
      })
      .addCase(getRecommendedVideos.pending, (state) => {
        state.isRecommendedLoading = true;
        state.recommendedError = null;
      })
      .addCase(getRecommendedVideos.fulfilled, (state, action) => {
        state.isRecommendedLoading = false;
        state.recommendedVideos = action.payload;
      })
      .addCase(getRecommendedVideos.rejected, (state, action) => {
        state.isRecommendedLoading = false;
        state.recommendedError = action.payload as string;
      })
      .addCase(getSubscribedVideos.pending, (state, action) => {
        // If lastVideoId was provided we are loading more, otherwise initial load
        const args = action.meta.arg as { limit: number; lastVideoId?: string | null };
        if (args?.lastVideoId) {
          state.subscribedIsLoadingMore = true;
        } else {
          state.subscribedVideosLoading = true;
        }
        state.subscribedVideosError = null;
      })
      .addCase(getSubscribedVideos.fulfilled, (state, action) => {
        const args = action.meta.arg as { limit: number; lastVideoId?: string | null };
        const payload = action.payload as { videos: Video[]; hasMoreVideos?: boolean; lastVideoId?: string | null };
        // If this was a load-more request (lastVideoId present) append, else replace
        if (args?.lastVideoId) {
          state.subscribedIsLoadingMore = false;
          state.subscribedVideos = state.subscribedVideos
            ? [...state.subscribedVideos, ...payload.videos]
            : payload.videos;
        } else {
          state.subscribedVideosLoading = false;
          state.subscribedVideos = payload.videos;
        }
        state.subscribedHasMore = !!payload.hasMoreVideos;
        state.subscribedLastVideoId = payload.lastVideoId || null;
      })
      .addCase(getSubscribedVideos.rejected, (state, action) => {
        const args = action.meta.arg as { limit: number; lastVideoId?: string | null };
        if (args?.lastVideoId) {
          state.subscribedIsLoadingMore = false;
        } else {
          state.subscribedVideosLoading = false;
        }
        state.subscribedVideosError = action.payload as string;
      });
  },
});

export const {
  clearVideoError,
  clearCurrentVideo,
  resetPublishState,
  updateVideoLikeCount,
} = videoSlice.actions;

export default videoSlice.reducer;
