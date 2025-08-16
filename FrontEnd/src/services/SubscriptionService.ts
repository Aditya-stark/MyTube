import apiClient from "../api/apiClient";

// Subscription related API calls
export const SubscriptionService = {
  // Toggle subscription for a channel
  toggleSubscription: async (channelId: string) => {
    try {
      const res = await apiClient.post(`/subscriptions/${channelId}`);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to toggle subscription");
      }
      return res.data;
    } catch (error) {
      console.error("Error toggling subscription:", error);
      throw error;
    }
  },

  // Get Susbcribed channel videos
  getSubscribedVideos: async (limit: number, lastVideoId?: string) => {
    try {
      const res = await apiClient.get("/videos/subscribed/videos", {
        params: { limit, lastVideoId },
      });
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to get subscribed videos");
      }
      return res.data;
    } catch (error: any) {
      console.log("Error getting the video at service");
      throw error;
    }
  },
};
