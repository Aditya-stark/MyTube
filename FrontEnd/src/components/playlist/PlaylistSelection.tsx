import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addVideoToPlaylist,
  getUserPlaylists,
  removeVideoFromPlaylist,
} from "../../features/playlistSlice";
import { AppDispatch, RootState } from "../../store/store";
import toast from "react-hot-toast";

interface PlaylistSelectionProps {
  setIsNewPlaylist: React.Dispatch<React.SetStateAction<boolean>>;
  videoId?: string;
}

const PlaylistSelection: React.FC<PlaylistSelectionProps> = ({
  setIsNewPlaylist,
  videoId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { playlists, loading } = useSelector(
    (state: RootState) => state.playlists
  );
  const [checkedPlaylists, setCheckedPlaylists] = useState<
    Record<string, boolean>
  >({});

  // Fetching user playlists on component mount
  useEffect(() => {
    dispatch(getUserPlaylists());
  }, [dispatch]);

  // Updating the checked playlist with initial state if video is in playlists
  useEffect(() => {
    if (videoId && playlists.length > 0) {
      const initialCheckedState: Record<string, boolean> = {};
      playlists.forEach((playlist) => {
        initialCheckedState[playlist._id] = isVideoInPlaylist(
          playlist,
          videoId
        );
      });

      setCheckedPlaylists(initialCheckedState);
    }
  }, [videoId, playlists]);

  // Helper function to check if video exists in playlist
  const isVideoInPlaylist = (playlist: any, videoId: string): boolean =>
    playlist.video.some(
      (video: any) => video === videoId || (video && video._id === videoId)
    );

  // Handle checkbox change
  const handleCheckboxChange = (
    playlistId: string,
    isCurrentlyChecked: boolean
  ) => {
    if (!videoId) return;

    // Toggle the state of the checkbox
    setCheckedPlaylists({
      ...checkedPlaylists,
      [playlistId]: !isCurrentlyChecked,
    });

    // API call to add/remove
    if (!isCurrentlyChecked) {
      //Add video to playlist
      dispatch(addVideoToPlaylist({ playlistId, videoId }))
        .unwrap()
        .then(() => {
          toast.success("Video added to playlist successfully");
          dispatch(getUserPlaylists());
        })
        .catch(() => {
          setCheckedPlaylists({
            ...checkedPlaylists,
            [playlistId]: false,
          });
          toast.error("Failed to add video to playlist");
        });
    } else {
      // Remove video from playlist
      dispatch(removeVideoFromPlaylist({ playlistId, videoId }))
        .unwrap()
        .then(() => {
          toast.success("Video removed from playlist successfully");
        })
        .catch(() => {
          setCheckedPlaylists({
            ...checkedPlaylists,
            [playlistId]: true,
          });
          toast.error("Failed to remove video from playlist");
        });
    }
  };

  return (
    <div className="text-sm">
      <h2 className="text-base font-semibold mb-3">Your Playlists</h2>
      <div className="mb-3">
        <div className="flex flex-col gap-1.5">
          {loading ? (
            <div className="flex items-center justify-center h-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div>
              {playlists.map((playlist) => (
                <label
                  key={playlist._id}
                  className="flex items-center gap-2 p-3 rounded cursor-pointer hover:bg-gray-200"
                >
                  <input
                    type="checkbox"
                    className="accent-blue-500 w-4 h-4"
                    checked={checkedPlaylists[playlist._id] || false}
                    onChange={() => {
                      handleCheckboxChange(
                        playlist._id,
                        checkedPlaylists[playlist._id] || false
                      );
                    }}
                  />
                  <div className="flex justify-between w-full">
                    <span>{playlist.name}</span>
                    <span>
                      {playlist.video ? playlist.video.length : 0} videos
                    </span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        onClick={() => setIsNewPlaylist(true)}
      >
        Create New Playlist
      </button>
    </div>
  );
};

export default PlaylistSelection;
