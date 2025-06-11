import React from "react";
import { Link } from "react-router-dom";
import { ResponseUser } from "../types/AuthType";
import { FiEdit2 } from "react-icons/fi";

interface UserProfileCardProps {
  user: ResponseUser;
  subscribersCount?: number;
  videosCount?: number;
  subscribedToCount?: number;
  isOwner?: boolean;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  subscribersCount = 0,
  videosCount = 0,
  subscribedToCount = 0,
  isOwner = true,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl w-full">
      {/* Cover Image with stronger gradient overlay */}
      <div className="h-28 sm:h-36 md:h-48 bg-gray-200 relative">
        {user.coverImage ? (
          <div className="relative h-full w-full">
            <img
              src={user.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10"></div>
          </div>
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-blue-600 to-blue-800"></div>
        )}
      </div>

      {/* Avatar Section - Separate from text content */}
      <div className="px-3 sm:px-4 md:px-6 relative">
        <div className="absolute -top-10 sm:-top-12 md:-top-14 left-3 sm:left-4 md:left-6">
          <img
            src={user.avatar}
            alt={user.username}
            className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-full ring-3 sm:ring-4 ring-white bg-white object-cover shadow-md"
          />
        </div>
      </div>

      {/* Text Content - With proper spacing */}
      <div className="px-3 sm:px-4 md:px-6 pt-12 sm:pt-14 md:pt-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 break-words">
              {user.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">@{user.username}</p>

            {/* Stats Section */}
            <div className="flex flex-wrap gap-1 sm:gap-2 md:gap-0 md:space-x-4 mb-2 sm:mb-3">
              <div className="flex items-center text-xs sm:text-sm">
                <span className="font-bold text-blue-600 mr-1">
                  {subscribersCount.toLocaleString()}
                </span>
                <span className="text-xxs sm:text-xs text-gray-500">subscribers</span>
              </div>
              <div className="flex items-center text-xs sm:text-sm">
                <span className="font-bold text-blue-600 mr-1">
                  {subscribedToCount.toLocaleString()}
                </span>
                <span className="text-xxs sm:text-xs text-gray-500">subscribed</span>
              </div>
              <div className="flex items-center text-xs sm:text-sm">
                <span className="font-bold text-blue-600 mr-1">
                  {videosCount.toLocaleString()}
                </span>
                <span className="text-xxs sm:text-xs text-gray-500">videos</span>
              </div>
            </div>
          </div>

          {/* Conditional Button */}
          <div className="mt-1 sm:mt-2 md:mt-0">
            {isOwner ? (
              <Link
                to="/edit-profile"
                className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-colors"
              >
                <FiEdit2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 md:mr-2" />
                <span className="md:inline hidden">Edit Profile</span>
                <span className="inline md:hidden">Edit</span>
              </Link>
            ) : (
              <button className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 border border-transparent text-xs sm:text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-colors">
                Subscribe
              </button>
            )}
          </div>
        </div>
      </div>

      {/* User Details */}
      <div className="border-t border-gray-100 px-3 sm:px-4 md:px-6 py-2 sm:py-3 flex flex-col md:flex-row md:justify-between md:items-center gap-1 sm:gap-2">
        <div className="flex items-center text-xs sm:text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mr-1 sm:mr-2 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
            />
          </svg>
          <span className="text-gray-700 truncate max-w-[180px] sm:max-w-[220px] md:max-w-none">{user.email}</span>
        </div>
        <div className="flex items-center text-xs sm:text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 mr-1 sm:mr-2 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-gray-700">
            Joined{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : ""}
          </span>
        </div>
      </div>
    </div>
  );
};
