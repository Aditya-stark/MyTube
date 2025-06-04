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
};
