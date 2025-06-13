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
      const params = new URLSearchParams();
      if (lastCommentId) {
        params.append("lastCommentId", lastCommentId);
      }
      const queryString = params.toString();
      const url = `/comments/video/${videoId}${
        queryString ? `?${queryString}` : ""
      }`;

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
  // Edit a comment
  editComment: async (editCommentId: string, editComment: string) => {
    try {
      const res = await apiClient.patch(`/comments/${editCommentId}`, {
        commentContent: editComment,
      });
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to edit comment");
      }
      return res.data;
    } catch (error) {
      console.error("Error editing comment:", error);
      throw error;
    }
  },
  // Delete a comment
  deleteComment: async (commentId: string) => {
    try {
      const res = await apiClient.delete(`/comments/${commentId}`);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to delete comment");
      }
      return res.data;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },


  
};

export default commentService;
