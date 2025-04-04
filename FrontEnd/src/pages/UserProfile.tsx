import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch } from "../store/store";
import { logout } from "../features/auth/authSlice";
import UploadNewVideoPopUp from "../components/video/UploadNewVideoPopUp";

const UserProfile: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const [isUploadPopupOpen, setIsUploadPopupOpen] = React.useState(false);

  const handleLogout = async () => {
    dispatch(logout());
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header/Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="text-xl font-bold text-blue-600">MyTube</div>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  {/* Upload Video Button */}
                  <button
                    onClick={() => setIsUploadPopupOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white opacity-50 hover:opacity-80 rounded-full p-2 pr-4 flex items-center justify-center transition-colors"
                    aria-label="Upload video"
                    title="Upload video"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="ml-1 text-sm font-medium">Upload</p>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Video Upload Popup */}
      <UploadNewVideoPopUp
        isOpen={isUploadPopupOpen}
        onClose={() => setIsUploadPopupOpen(false)}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* User Profile Card */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Cover Image */}
            <div className="h-48 bg-gray-200 relative">
              {user.coverImage && (
                <img
                  src={user.coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Avatar and Basic Info */}
            <div className="px-4 py-5 sm:px-6 flex flex-col items-center sm:flex-row sm:items-end -mt-16 relative z-10">
              <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="h-24 w-24 rounded-full ring-4 ring-white bg-white object-cover"
                />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.fullName}
                </h1>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </div>

            {/* User Details */}
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Joined</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">
                    Account ID
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 break-all">
                    {user._id}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
              <div className="flex justify-end space-x-3">
                <Link
                  to="/edit-profile"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Stats and Activity */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Video Stats */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">
                  Video Stats
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <div className="flex flex-col border-2 border-gray-200 rounded-lg p-4 text-center">
                      <dt className="text-sm font-medium text-gray-500">
                        Videos
                      </dt>
                      <dd className="text-3xl font-extrabold text-blue-600">
                        0
                      </dd>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="flex flex-col border-2 border-gray-200 rounded-lg p-4 text-center">
                      <dt className="text-sm font-medium text-gray-500">
                        Views
                      </dt>
                      <dd className="text-3xl font-extrabold text-blue-600">
                        0
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    to="/videos"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    View all videos
                  </Link>
                </div>
              </div>
            </div>

            {/* Subscribers */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">
                  Subscribers
                </h3>
                <div className="mt-4">
                  <div className="flex flex-col border-2 border-gray-200 rounded-lg p-4 text-center">
                    <dt className="text-sm font-medium text-gray-500">
                      Total Subscribers
                    </dt>
                    <dd className="text-3xl font-extrabold text-blue-600">0</dd>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <Link
                    to="/subscribers"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Manage subscribers
                  </Link>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">
                  Account Status
                </h3>
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
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
