import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SubscribedToData, SubscriberData } from "../types/SubscriptionType";
import { SubscriptionService } from "../services/SubscriptionService";

export const toggleSubscription = createAsyncThunk(
  "subscription/toggleSubscription",
  async (channelId: string, { rejectWithValue }) => {
    try {
      const res = await SubscriptionService.toggleSubscription(channelId);
      if (res.success) {
        return res.data;
      }
      return rejectWithValue(res.message || "Failed to toggle subscription");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data.message || "Failed to toggle subscription"
      );
    }
  }
);

interface SubscriptionState {
  isSubscribed: boolean | null;
  totalSubscriber: SubscriberData[] | null;
  totalSubscribedChannels: SubscribedToData[] | null;
  subscriptionLoading: boolean;
  subscriptionError: string | null;
}

const initialState: SubscriptionState = {
  isSubscribed: null,
  totalSubscriber: null,
  totalSubscribedChannels: null,
  subscriptionLoading: false,
  subscriptionError: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    clearSubscriptionError: (state) => {
      state.subscriptionError = null;
    },
    clearIsSubscribed: (state) => {
      state.isSubscribed = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleSubscription.pending, (state) => {
        state.subscriptionLoading = true;
        state.subscriptionError = null;
      })
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        state.subscriptionLoading = false;
        state.isSubscribed = action.payload.isSubscribed;
      })
      .addCase(toggleSubscription.rejected, (state, action) => {
        state.subscriptionLoading = false;
        state.subscriptionError = action.payload as string;
      });
  },
});
