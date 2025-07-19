import apiClient from "../api/apiClient";

export const PlayListService = {
  createPlaylist: async (playlistData: {
    name: string;
    description: string;
  }) => {
    try {
      const res = await apiClient.post("/playlists/", playlistData);
      if (res.data.success) {
        return res.data;
      }
      throw new Error(res.data.message || "Failed to create playlist");
    } catch (error: any) {
      console.error("Error creating playlist:", error);
      throw error;
    }
  },

  // Add a video to a playlist
  addVideoToPlaylist: async (playlistId: string, videoId: string) => {
    try {
      const res = await apiClient.post(
        `/playlists/${playlistId}/videos/${videoId}`
      );
      if (res.data.success) {
        return res.data;
      }
      throw new Error(res.data.message || "Failed to add video to playlist");
    } catch (error: any) {
      console.error("Error adding video to playlist:", error);
      throw error;
    }
  },

  // Remove a video from a playlist
  removeVideoFromPlaylist: async (playlistId: string, videoId: string) => {
    try {
      const res = await apiClient.delete(
        `/playlists/${playlistId}/videos/${videoId}`
      );
      if (res.data.success) {
        return res.data;
      }
      throw new Error(
        res.data.message || "Failed to remove video from playlist"
      );
    } catch (error: any) {
      console.error("Error removing video from playlist:", error);
      throw error;
    }
  },

  // Get all playlists for a user
  getUserPlaylists: async () => {
    try {
      const res = await apiClient.get("/playlists/");
      if (res.data.success) {
        return res.data;
      }
      throw new Error(res.data.message || "Failed to fetch user playlists");
    } catch (error: any) {
      console.error("Error fetching user playlists:", error);
      throw error;
    }
  },

  // Get a specific playlist by ID
  getPlaylistById: async (playlistId: string) => {
    try {
      const res = await apiClient.get(`/playlists/${playlistId}`);
      if (res.data.success) {
        console.log("Playlist fetched successfully:", res.data);
        return res.data;
      }
    } catch (error: any) {
      console.error("Error fetching playlist by ID:", error);
      throw error;
    }
  },

  // Get playlists by username
  getPlaylistsByUsername: async (username: string) => {
    try {
      const cleanUsername = username.startsWith("@")
        ? username.substring(1)
        : username;

      const res = await apiClient.get(`/playlists/username/${cleanUsername}`);
      if (res.data.success) {
        return res.data;
      }
      throw new Error(
        res.data.message || "Failed to fetch playlists by username"
      );
    } catch (error: any) {
      console.error("Error fetching playlists by username:", error);
      throw error;
    }
  },
};
