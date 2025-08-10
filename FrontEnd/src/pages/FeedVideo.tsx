// Current user videos page /feed/videos
// References: FeedPlaylist (pattern for current user resources) & VideoTabPage (VideoTab usage)

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UploadNewVideoPopUp from "../components/video/UploadNewVideoPopUp";
import VideoTab from "../components/video/Tabs/VideoTab";
import { AppDispatch, RootState } from "../store/store";
import { getVideosByUsername } from "../features/videos/videoSlice";

const FeedVideo: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);

  const authUser = useSelector((state: RootState) => state.auth.user);
  const {
    videos,
    isLoading,
    isLoadingMore = false,
  } = useSelector((state: RootState) => state.videos);

  // Redirect guest users
  useEffect(() => {
    if (authUser === null) {
      navigate("/login", { replace: true });
    }
  }, [authUser, navigate]);

  useEffect(() => {
    if (authUser?.username) {
      dispatch(getVideosByUsername({ username: authUser.username }));
    }
  }, [authUser?.username, dispatch]);

  if (authUser === null) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <UploadNewVideoPopUp
        isOpen={isUploadPopupOpen}
        onClose={() => setIsUploadPopupOpen(false)}
      />
      <div className="max-w-8xl mx-0 sm:mx-5 lg:mx-10  sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="pt-6">
            <VideoTab
              username={authUser.username}
              videos={videos}
              isLoading={isLoading}
              isLoadingMore={isLoadingMore as boolean}
              setIsUploadPopupOpen={setIsUploadPopupOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedVideo;
