import apiClient from "../api/apiClient";

export const VideoService = {
  //Publish video
  publishVideo: async (VideoData: FormData) => {
    try {
      const res = await apiClient.post("/videos/publish", VideoData);
      return res.data;
    } catch (error) {
      console.error("Error publishing video:", error);
      throw error;
    }
  },
};

export default VideoService;
