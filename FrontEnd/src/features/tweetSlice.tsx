import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TweetService } from "../services/TweetService";
import { Tweet } from "../types/TweetType";

export const addTweet = createAsyncThunk(
  "tweets/addTweet",
  async (tweetData: string, { rejectWithValue }) => {
    try {
      const res = await TweetService.addTweet(tweetData);
      console.log("Add tweet response:", res);
      if (res.success) {
        return res.data;
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message || "Something went wrong"
      );
    }
  }
);

export const getUserInitialTweets = createAsyncThunk(
  "tweets/getUserInitialTweets",
  async (_, { rejectWithValue }) => {
    try {
      const res = await TweetService.getUserTweets();
      if (res.success) {
        return res.data;
      }
      return rejectWithValue(res.message || "Failed to fetch initial tweets");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message || "Failed to fetch initial tweets"
      );
    }
  }
);

export const getUserMoreTweets = createAsyncThunk(
  "tweets/getUserMoreTweets",
  async (lastTweetId: string, { rejectWithValue }) => {
    try {
      const res = await TweetService.getUserTweets(lastTweetId);
      if (res.success) {
        return res.data;
      }
      return rejectWithValue(res.message || "Failed to fetch more tweets");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message || "Failed to fetch more tweets"
      );
    }
  }
);

export const updateTweet = createAsyncThunk(
  "tweets/updateTweet",
  async (
    { tweetId, content }: { tweetId: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await TweetService.updateTweet(tweetId, content);
      console.log("Update tweet response:", res);
      if (res.success) {
        return res.data;
      }
      return rejectWithValue(res.message || "Failed to update tweet");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message || "Failed to update tweet"
      );
    }
  }
);

export const deleteTweet = createAsyncThunk(
  "tweets/deleteTweet",
  async (tweetId: string, { rejectWithValue }) => {
    try {
      const res = await TweetService.deleteTweet(tweetId);
      if (res.success) {
        return tweetId; // Return the tweet ID for deletion
      }
      return rejectWithValue(res.message || "Failed to delete tweet");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message || "Failed to delete tweet"
      );
    }
  }
);

interface TweetState {
  tweets: Tweet[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  isAddingTweet: boolean;
  isLoadingMore: boolean;
  lastTweetId: string | null;
  totalTweets?: number;
}

const initialState: TweetState = {
  tweets: [],
  loading: false,
  error: null,
  hasMore: false,
  isAddingTweet: false,
  isLoadingMore: false,
  lastTweetId: null,
  totalTweets: 0,
};

const tweetSlice = createSlice({
  name: "tweets",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTweet.pending, (state) => {
        state.loading = true;
        state.isAddingTweet = true;
        state.error = null;
      })
      .addCase(addTweet.fulfilled, (state) => {
        state.loading = false;
        state.isAddingTweet = false;
        
      })
      .addCase(addTweet.rejected, (state, action) => {
        state.loading = false;
        state.isAddingTweet = false;
        state.error = action.payload as string;
      })
      .addCase(getUserInitialTweets.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.tweets = [];
        state.hasMore = false;
        state.lastTweetId = null;
      })
      .addCase(getUserInitialTweets.fulfilled, (state, action) => {
        state.loading = false;
        state.tweets = action.payload.tweets;
        state.hasMore = action.payload.hasMore;
        state.lastTweetId = action.payload.lastTweetId;
        state.totalTweets = action.payload.totalTweets;
      })
      .addCase(getUserInitialTweets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.tweets = [];
        state.hasMore = false;
        state.lastTweetId = null;
      })
      .addCase(updateTweet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTweet.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTweet = action.payload.content;
        const tweetIndex = state.tweets.findIndex(
          (tweet) => tweet._id === action.payload._id
        );
        if (tweetIndex !== -1) {
          state.tweets[tweetIndex].content = updatedTweet;
        }
      })
      .addCase(updateTweet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTweet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTweet.fulfilled, (state, action) => {
        state.loading = false;
        const tweetId = action.meta.arg;
        state.tweets = state.tweets.filter((tweet) => tweet._id !== tweetId);
        state.totalTweets = state.totalTweets ? state.totalTweets - 1 : 0;
        if (state.tweets.length === 0) {
          state.hasMore = false;
          state.lastTweetId = null;
        }
      })
      .addCase(deleteTweet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getUserMoreTweets.pending, (state) => {
        state.isLoadingMore = true;
        state.error = null;
      })
      .addCase(getUserMoreTweets.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        const newTweets = action.payload.tweets;
        state.tweets = [...state.tweets, ...newTweets];
        state.hasMore = action.payload.hasMore;
        state.lastTweetId = action.payload.lastTweetId;
      });
  },
});

export const { clearError } = tweetSlice.actions;
export default tweetSlice.reducer;
