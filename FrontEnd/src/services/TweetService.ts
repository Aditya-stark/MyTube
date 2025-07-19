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

  // Fetch tweets for the user
  getUserTweets: async (username: string, lastTweetId?: string) => {
    try {
      let url = `/tweets/user/${username}`;
      if (lastTweetId) {
        url += `?lastTweetId=${lastTweetId}`;
      }
      const res = await apiClient.get(url);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch user tweets");
      }
      return res.data;
    } catch (error) {
      console.error("Error fetching initial tweets:", error);
      throw error;
    }
  },

  // Edit a tweet
  updateTweet: async (tweetId: string, content: string) => {
    try {
      const res = await apiClient.patch(`/tweets/${tweetId}`, { content });
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to edit tweet");
      }
      return res.data;
    } catch (error) {
      console.error("Error editing tweet:", error);
      throw error;
    }
  },

  // Delete a tweet
  deleteTweet: async (tweetId: string) => {
    try {
      const res = await apiClient.delete(`/tweets/${tweetId}`);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to delete tweet");
      }
      return res.data;
    } catch (error) {
      console.error("Error deleting tweet:", error);
      throw error;
    }
  },
};
