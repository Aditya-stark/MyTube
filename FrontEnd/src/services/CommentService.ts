import apiClient from "../api/apiClient";

export const commentService = {
  // Add a comment to a vide
  addComment: async (videoId: string, commentData: string) => {
    try {
      const res = await apiClient.post(`/comments/video/${videoId}`, {
        commentContent: commentData,
      });

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to add comment");
      }
      return res.data;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  },
  // Get comments for a video
  getComments: async (videoId: string, lastCommentId?: string) => {
    try {
      let url = `/comments/video/${videoId}`;
      // If lastCommentId is provided, append it as a query parameter
      const params = new URLSearchParams();
      if (lastCommentId) params.append("lastCommentId", lastCommentId);
      url += `?${params.toString()}`;

      const res = await apiClient.get(url);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch comments");
      }
      return res.data;
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },
};

export default commentService;
