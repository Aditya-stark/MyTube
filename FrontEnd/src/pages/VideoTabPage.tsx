import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import UploadNewVideoPopUp from "../components/video/UploadNewVideoPopUp";
import { getUserVideos } from "../features/videos/videoSlice";
import VideoTab from "../components/video/Tabs/VideoTab";
import { UserProfileCard } from "../components/UserProfileCard";
import NavigationTabs from "../components/NavigationTabs";

const VideoTabPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
  const {
    videos,
    isLoading,
    isLoadingMore = false,
  } = useSelector((state: RootState) => state.videos);

  useEffect(() => {
    dispatch(getUserVideos({}));
  }, [dispatch, isUploadPopupOpen]);

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
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <UserProfileCard user={user} />

          {/* Navigation Tabs */}
          <NavigationTabs />

          {/* Tab Content */}
          <div className="pt-6">
            <VideoTab
              videos={videos}
              isLoading={isLoading}
              isLoadingMore={isLoadingMore}
              setIsUploadPopupOpen={setIsUploadPopupOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTabPage;
