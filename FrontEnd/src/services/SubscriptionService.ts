import apiClient from "../api/apiClient";

export const SubscriptionService = {
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
};

