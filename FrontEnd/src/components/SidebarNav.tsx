import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HiHome,
  HiUserGroup,
  HiClock,
  HiCollection,
  HiVideoCamera,
  HiHeart,
} from "react-icons/hi";
import { useSidebar } from "../contexts/SidebarContext";

interface SidebarItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SidebarNav: React.FC = () => {
  const { isOpen, closeSidebar, isMobile } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems: SidebarItem[] = [
    { id: "home", label: "Home", path: "/", icon: HiHome },
    {
      id: "subscriptions",
      label: "Subscriptions",
      path: "/feed/subscriptions",
      icon: HiUserGroup,
    },
    { id: "history", label: "History", path: "/feed/history", icon: HiClock },
    {
      id: "playlists",
      label: "Playlists",
      path: "/feed/playlists",
      icon: HiCollection,
    },
    {
      id: "videos",
      label: "Your Videos",
      path: "/feed/videos",
      icon: HiVideoCamera,
    },
    {
      id: "liked",
      label: "Liked Videos",
      path: "/feed/liked-videos",
      icon: HiHeart,
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      closeSidebar(); // Close sidebar on mobile after navigation
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-lg z-40 ${
          isMobile
            ? // Mobile behavior - overlay
              `w-64 ${isOpen ? "translate-x-0" : "-translate-x-full"}`
            : // Desktop behavior - fixed with width change
              `${isOpen ? "w-52" : "w-16"} translate-x-0`
        }`}
      >
        {/* Navigation Items */}
        <nav>
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 transition-colors ${
                  isActive ? "text-blue-600" : "text-gray-700"
                }`}
                title={!isOpen ? item.label : undefined}
              >
                <IconComponent
                  className={`w-6 h-6 ${
                    isActive ? "text-blue-600" : "text-gray-600"
                  }`}
                />
                {isOpen && (
                  <span
                    className={`ml-4 font-medium ${
                      isActive ? "text-blue-600" : "text-gray-700"
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default SidebarNav;
