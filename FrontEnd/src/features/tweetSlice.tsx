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

interface TweetState {
  tweets: Tweet[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  isAddingTweet: boolean;
  isLoadingMore: boolean;
  lastTweetId: string | null;
}

const initialState: TweetState = {
  tweets: [],
  loading: false,
  error: null,
  hasMore: false,
  isAddingTweet: false,
  isLoadingMore: false,
  lastTweetId: null,
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
      });
  },
});

export const { clearError } = tweetSlice.actions;
export default tweetSlice.reducer;
