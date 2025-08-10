import apiClient from "../api/apiClient";

export const LikesService = {
  //Toggle Video Like
  toggleVideoLike: async (videoId: string) => {
    try {
      const res = await apiClient.post(`/likes/video/like/${videoId}`);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to toggle video like");
      }
      console.log("Video like toggled successfully:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error toggling video like:", error);
      throw error;
    }
  },

  // Get Video Like Status
  getVideoLikeStatus: async (videoId: string) => {
    const res = await apiClient.get(`/likes/video/like-status/${videoId}`);
    return res.data;
  },

  // Toggle Comment Like
  toggleCommentLike: async (commentId: string) => {
    try {
      const res = await apiClient.post(`/likes/comment/like/${commentId}`);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to toggle comment like");
      }
      console.log("Comment like toggled successfully:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error toggling comment like:", error);
      throw error;
    }
  },

  // Get Comment Like Status
  getCommentLikeStatus: async (commentId: string) => {
    try {
      const res = await apiClient.get(
        `/likes/comment/like-status/${commentId}`
      );
      return res.data;
    } catch (error) {
      console.error("Error getting comment like status:", error);
      throw error;
    }
  },

  //Get Liked videos
  getLikedVideos: async () => {
    try {
      const res = await apiClient.get(`/likes/video/liked`);
      return res.data;
    } catch (error) {
      console.error("Error getting liked videos:", error);
      throw error;
    }
  },
};
