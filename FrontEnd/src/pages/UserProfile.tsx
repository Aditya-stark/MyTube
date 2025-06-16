import React, { useState } from "react";
import { useSelector } from "react-redux";
import UploadNewVideoPopUp from "../components/video/UploadNewVideoPopUp";
import HomeTab from "../components/video/Tabs/HomeTab";
import { UserProfileCard } from "../components/UserProfileCard";
import NavigationTabs from "../components/NavigationTabs";

const UserProfile: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);

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
      <div className="px-4 py-6">
        {/* User Profile Card */}
        <UserProfileCard user={user} />

        {/* Use Navigation Tabs */}
        <NavigationTabs />

        <div className="pt-6">
          <HomeTab user={user} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
