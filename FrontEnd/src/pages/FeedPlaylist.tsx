// This is for the current user playlist page /feed/playlist

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useEffect, useState } from "react";
import { getUserPlaylists } from "../features/playlistSlice";
import UploadNewVideoPopUp from "../components/video/UploadNewVideoPopUp";
import PlaylistCard from "../components/playlist/PlaylistCard";

const FeedPlaylist: React.FC = () => {
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { playlists, loading } = useSelector(
    (state: RootState) => state.playlists
  );
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    // Fetch user playlists or any other data needed for the playlist if currentUser exists
    if (currentUser) {
      dispatch(getUserPlaylists());
    }
  }, [currentUser, dispatch]);

  console.log("Current User Playlists:", playlists);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <UploadNewVideoPopUp
        isOpen={isUploadPopupOpen}
        onClose={() => setIsUploadPopupOpen(false)}
      />
      <div className="max-w-8xl mx-0 sm:mx-5 lg:mx-10  sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="min-h-screen flex flex-col rounded-lg mt-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              My Playlists
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1">
              {playlists.length > 0 ? (
                playlists
                  .filter(
                    (playlist) => playlist.video && playlist.video.length > 0
                  )
                  .map((playlist) => (
                    <PlaylistCard key={playlist._id} playlist={playlist} />
                  ))
              ) : (
                <p className="text-gray-500">No playlists found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPlaylist;
