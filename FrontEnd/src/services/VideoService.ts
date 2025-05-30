import toast from "react-hot-toast";
import apiClient from "../api/apiClient";

let progressToastId: string;

export const VideoService = {
  //Publish video
  publishVideo: async (VideoData: FormData) => {
    try {
      progressToastId = toast.loading("uploading video...", {
        duration: Infinity,
      });

      const res = await apiClient.post("/videos/publish", VideoData, {
        timeout: 0,
        headers: {
          "Content-type": "mutilpart/form-data",
        },
        // This is the key part for tracking upload progress
        onUploadProgress: (progressEvent) => {
          const percent = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;

          if (percent < 100) {
            toast.loading(`Uploading video... ${percent}%`, {
              id: progressToastId,
            });
          } else {
            toast.loading(`Proccesing video...`, { id: progressToastId });
          }
        },
      });

      toast.dismiss(progressToastId);

      console.log("Publish video response VIDEOSERVICE:", res);
      return res.data;
    } catch (error) {
      console.error("Error publishing video:", error);
      throw error;
    }
  },

  // Get user Videos
  getUserVideos: async (lastVideoId?: string, sortBy?: string) => {
    try {
      let url = "/videos/videos";
      const params = new URLSearchParams();
      if (lastVideoId) params.append("lastVideoId", lastVideoId);
      if (sortBy) params.append("sortBy", sortBy);
      url += `?${params.toString()}`;

      const res = await apiClient.get(url);
      return res.data;
    } catch (error) {
      console.error("Error fetching user videos:", error);
      throw error;
    }
  },

  // Get video by ID
  getVideoById: async (videoId: string) => {
    try {
      const res = await apiClient.get(`/videos/${videoId}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching video by ID:", error);
      throw error;
    }
  },

  // Update video details
  updateVideoDetails: async (videoId: string, VideoData: FormData) => {
    try {
      const res = await apiClient.patch(
        `/videos/update/${videoId}`,
        VideoData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to update video details");
      }
      toast.success("Video details updated successfully!");

      return res.data;
    } catch (error) {
      console.error("Error updating video details:", error);
      throw error;
    }
  },

  // Delete video
  deleteVideo: async (videoId: string) => {
    try {
      const res = await apiClient.delete(`/videos/delete/${videoId}`);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to delete video");
      }
      toast.success("Video deleted successfully!");
      return res.data;
    } catch (error) {
      console.error("Error deleting video:", error);
      throw error;
    }
  },
};

export default VideoService;
