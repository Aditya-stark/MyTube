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
};

export default commentService;
