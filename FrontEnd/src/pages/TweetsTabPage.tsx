import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import UploadNewVideoPopUp from "../components/video/UploadNewVideoPopUp";
import { UserProfileCard } from "../components/UserProfileCard";
import NavigationTabs from "../components/NavigationTabs";
import TweetTab from "../components/tweet/TweetTab";

const TweetsTabPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
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
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <UserProfileCard user={user} />
          {/* Navigation Tabs */}
          <NavigationTabs />
          {/* Tab Content */}
          <div className="min-h-screen flex flex-col rounded-lg mt-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">My Tweets</h2>
            <TweetTab user={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetsTabPage;
