import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UploadNewVideoPopUp from "../components/video/UploadNewVideoPopUp";
import HomeTab from "../components/video/Tabs/HomeTab";
import { UserProfileCard } from "../components/UserProfileCard";
import NavigationTabs from "../components/NavigationTabs";
import { useParams } from "react-router";
import { AppDispatch, RootState } from "../store/store";
import { getUserByUsername } from "../features/auth/authSlice";

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { channelProfileData, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );
  useEffect(() => {
    if (username) {
      dispatch(getUserByUsername(username));
    }
  }, [username, dispatch]);

  if (!channelProfileData && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading user profile: {error}</p>
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
          {/* User Profile Card */}
          <UserProfileCard />

          {/* Use Navigation Tabs */}
          <NavigationTabs />

          <div className="pt-6">
            {channelProfileData && <HomeTab user={channelProfileData} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
