import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import UploadNewVideoPopUp from "../components/video/UploadNewVideoPopUp";
import { getVideosByUsername } from "../features/videos/videoSlice";
import VideoTab from "../components/video/Tabs/VideoTab";
import { UserProfileCard } from "../components/UserProfileCard";
import NavigationTabs from "../components/NavigationTabs";
import { useParams } from "react-router-dom";
import { getUserByUsername } from "../features/auth/authSlice";

const VideoTabPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
  const {
    videos,
    isLoading,
    isLoadingMore = false,
  } = useSelector((state: RootState) => state.videos);
  const { username } = useParams<{ username: string }>();

  useEffect(() => {
    if (username) {
      dispatch(getUserByUsername(username));
      dispatch(getVideosByUsername({ username: username }));
    }
  }, [username, dispatch]);

  return (
    <div className="min-h-screen bg-gray-100">
      <UploadNewVideoPopUp
        isOpen={isUploadPopupOpen}
        onClose={() => setIsUploadPopupOpen(false)}
      />
      <div className="max-w-8xl mx-0 sm:mx-5 lg:mx-10  sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <UserProfileCard />

          {/* Navigation Tabs */}
          <NavigationTabs />

          {/* Tab Content */}
          <div className="pt-6">
            <VideoTab
              username={username || ""}
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
