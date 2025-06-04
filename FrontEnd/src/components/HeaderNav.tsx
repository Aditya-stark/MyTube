import React from "react";
import { useNavigate } from "react-router";

const HeaderNav: React.FC<{
  onUploadClick?: () => void;
  onLogoutClick?: () => void;
}> = ({ onUploadClick, onLogoutClick }) => {
  const navigate = useNavigate();
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div
              className="text-xl font-bold text-blue-600 cursor-pointer select-none"
              onClick={() => navigate("/")}
            >
              MyTube
            </div>
          </div>
          <div className="flex items-center">
            <div className="ml-3 relative">
              <div className="flex items-center space-x-4">
                {onUploadClick && (
                  <button
                    onClick={onUploadClick}
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
                )}
                {onLogoutClick && (
                  <button
                    onClick={onLogoutClick}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HeaderNav;
