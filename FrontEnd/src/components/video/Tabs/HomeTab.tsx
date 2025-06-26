import React from "react";
import { ChannelProfileData } from "../../../types/AuthType";

const HomeTab: React.FC<{ user: ChannelProfileData }> = ({ user }) => {
  console.log("HomeTab user", user);
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Video Stats */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-5">
          <h3 className="text-lg font-medium text-gray-900">Video Stats</h3>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <div className="flex flex-col border-2 border-gray-200 rounded-lg p-4 text-center">
                <dt className="text-sm font-medium text-gray-500">Videos</dt>
                <dd className="text-3xl font-extrabold text-blue-600">
                  {user.totalVideosCount}
                </dd>
              </div>
            </div>
            <div className="col-span-1">
              <div className="flex flex-col border-2 border-gray-200 rounded-lg p-4 text-center">
                <dt className="text-sm font-medium text-gray-500">Views</dt>
                <dd className="text-3xl font-extrabold text-blue-600">0</dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <a
              href="/videos"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              View all videos
            </a>
          </div>
        </div>
      </div>
      {/* Subscribers */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-5">
          <h3 className="text-lg font-medium text-gray-900">Subscribers</h3>
          <div className="mt-4">
            <div className="flex flex-col border-2 border-gray-200 rounded-lg p-4 text-center">
              <dt className="text-sm font-medium text-gray-500">
                Total Subscribers
              </dt>
              <dd className="text-3xl font-extrabold text-blue-600">
                {user.subscriberCount || 0}
              </dd>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <a
              href="/subscribers"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Manage subscribers
            </a>
          </div>
        </div>
      </div>
      {/* Account Status */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-5">
          <h3 className="text-lg font-medium text-gray-900">Account Status</h3>
          <div className="mt-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">
                  Account Active
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your account is in good standing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTab;
