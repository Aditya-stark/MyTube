import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import UploadNewVideoPopUp from "../components/video/UploadNewVideoPopUp";
import { getUserVideos } from "../features/videos/videoSlice";
import VideoTab from "../components/video/Tabs/VideoTab";
import { UserProfileCard } from "../components/UserProfileCard";
import { useNavigate } from "react-router-dom";

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

  // Tab state: 'videos' is active for this page
  const [activeTab, setActiveTab] = useState<"home" | "videos">("videos");
  const navigate = useNavigate ? useNavigate() : null;

  return (
    <div className="min-h-screen bg-gray-100">
      <UploadNewVideoPopUp
        isOpen={isUploadPopupOpen}
        onClose={() => setIsUploadPopupOpen(false)}
      />
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <UserProfileCard user={user} />
          {/* Tabs for Home | My Videos */}
          <div className="mt-2">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "home"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => navigate && navigate("/")}
                  type="button"
                >
                  Home
                </button>
                <button
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "videos"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  onClick={() => setActiveTab("videos")}
                  type="button"
                >
                  My Videos
                </button>
              </nav>
            </div>
            {/* Tab Content */}
            <div className="pt-6">
              {activeTab === "videos" && (
                <VideoTab
                  videos={videos}
                  isLoading={isLoading}
                  isLoadingMore={isLoadingMore}
                  setIsUploadPopupOpen={setIsUploadPopupOpen}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTabPage;
