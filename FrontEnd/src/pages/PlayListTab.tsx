import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import UploadNewVideoPopUp from "../components/video/UploadNewVideoPopUp";
import { UserProfileCard } from "../components/UserProfileCard";
import NavigationTabs from "../components/NavigationTabs";
import { getUserPlaylists } from "../features/playlistSlice";
import PlaylistCard from "../components/playlist/PlaylistCard";

const PlayListTabPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { playlists } = useSelector((state: RootState) => state.playlists);

  useEffect(() => {
    dispatch(getUserPlaylists());
  }, [dispatch]);

  if (!user) {
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
          <UserProfileCard user={user} />
          {/* Navigation Tabs */}
          <NavigationTabs />
          {/* Tab Content */}
          <div className="min-h-screen flex flex-col rounded-lg mt-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              My Playlists
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6  gap-2">
              {playlists.length > 0 ? (
                playlists.map((playlist) => (
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

export default PlayListTabPage;
