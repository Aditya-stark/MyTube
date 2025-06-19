import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserPlaylists } from "../../features/playlistSlice";
import { AppDispatch, RootState } from "../../store/store";

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

  useEffect(() => {
    dispatch(getUserPlaylists())
      .unwrap()
      .then(() => {
        console.log("Playlists fetched successfully");
      })
      .catch((error) => {
        console.error("Failed to fetch playlists:", error);
      });
  }, [dispatch]);

  // Helper function to check if video exists in playlist
  const isVideoInPlaylist = (playlist: any, videoId: string): boolean =>
    playlist.video.some(
      (video: any) => video === videoId || (video && video._id === videoId)
    );

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
                    checked={
                      videoId ? isVideoInPlaylist(playlist, videoId) : false
                    }
                    onChange={() => {
                      console.log(
                        `Toggle video ${videoId} in playlist ${playlist._id}`
                      );
                    }}
                  />{" "}
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
