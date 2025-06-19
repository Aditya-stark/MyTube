import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PlayListService } from "../services/PlayListService";
import { Playlist } from "../types/PlaylistType";

export const createPlaylist = createAsyncThunk(
  "playlists/createPlaylist",
  async (
    {
      playlistName,
      playlistDescription,
    }: {
      playlistName: string;
      playlistDescription: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await PlayListService.createPlaylist({
        name: playlistName,
        description: playlistDescription,
      });

      if (res.success) {
        return res.data;
      }
      return rejectWithValue(res.message || "Failed to create playlist");
    } catch (error: any) {
      console.error("Error creating playlist:", error);
      return rejectWithValue(
        error.response?.data.message || "Something went wrong"
      );
    }
  }
);

export const addVideoToPlaylist = createAsyncThunk(
  "playlists/addVideoToPlaylist",
  async (
    { playlistId, videoId }: { playlistId: string; videoId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await PlayListService.addVideoToPlaylist(playlistId, videoId);
      if (res.success) {
        console.log("Video added to playlist successfully:", res);
        return res.data;
      }
      return rejectWithValue(res.message || "Failed to add video to playlist");
    } catch (error: any) {
      console.error("Error adding video to playlist:", error);
      return rejectWithValue(
        error.response?.data.message || "Something went wrong"
      );
    }
  }
);

export const getUserPlaylists = createAsyncThunk(
  "playlists/getUserPlaylists",
  async (_, { rejectWithValue }) => {
    try {
      const res = await PlayListService.getUserPlaylists();
      if (res.success) {
        return res.data;
      }
      return rejectWithValue(res.message || "Failed to fetch user playlists");
    } catch (error: any) {
      console.error("Error fetching user playlists:", error);
      return rejectWithValue(
        error.response?.data.message || "Something went wrong"
      );
    }
  }
);

interface PlaylistState {
  playlists: Playlist[];
  loading: boolean;
  error: string | null;
  totalPlaylists: number;
}

const initialState: PlaylistState = {
  playlists: [],
  loading: false,
  error: null,
  totalPlaylists: 0,
};

const playlistSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlaylist.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("Error creating playlist:", action.payload);
      })
      .addCase(addVideoToPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addVideoToPlaylist.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(addVideoToPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getUserPlaylists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPlaylists.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists = action.payload;
        state.totalPlaylists = action.payload.length;
        state.error = null;
      })
      .addCase(getUserPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError: clearPlaylistError } = playlistSlice.actions;
export default playlistSlice.reducer;
