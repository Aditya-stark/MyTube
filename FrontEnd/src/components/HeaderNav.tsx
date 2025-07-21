import React from "react";
import { useNavigate, useLocation } from "react-router";
import { HiMenu } from "react-icons/hi"; // Add this import
import { useSidebar } from "../contexts/SidebarContext"; // Add this import
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const HeaderNav: React.FC<{
  onUploadClick?: () => void;
  onLogoutClick?: () => void;
}> = ({ onUploadClick, onLogoutClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleSidebar } = useSidebar();

  // Pages where sidebar should NOT be shown (same logic as before)
  const hideSidebarPages = [
    "/watch",
    "/login",
    "/register",
    "/forgot-password",
  ];
  const shouldShowSidebar = !hideSidebarPages.includes(location.pathname);
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  return (
    <nav className="bg-white sticky top-0 z-50">
      <div className=" mx-auto px-3 lg:px-2">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            {/* Hamburger Menu - Only show on pages that have sidebar */}
            {shouldShowSidebar && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Toggle sidebar"
              >
                <HiMenu className="w-6 h-6 text-gray-600" />
              </button>
            )}

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
                {onUploadClick && user && (
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
                {/* If User is logout out show login Button and if already logged in show logout button */}
                {user ? (
                  <>
                    {onLogoutClick && (
                      <button
                        onClick={onLogoutClick}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Logout
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </button>
                )}

                {user && (
                  <>
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full cursor-pointer object-cover"
                            onClick={() => navigate(`/${user.username}`)}
                          />
                        ) : (
                          <div
                            className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer"
                            onClick={() => navigate(`/${user?.username}`)}
                          >
                            <span className="text-gray-600 text-sm">
                              {user?.username?.[0]?.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </>
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
