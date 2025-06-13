import apiClient from "../api/apiClient";

//Add a tweet
export const TweetService = {
  addTweet: async (tweetData: string) => {
    try {
      const res = await apiClient.post("/tweets/", { content: tweetData });
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to add tweet");
      }
      return res.data;
    } catch (error) {
      console.error("Error adding tweet:", error);
      throw error;
    }
  },
};
