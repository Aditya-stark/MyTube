import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface Tab {
  id: string;
  label: string;
  path: string;
}

interface NavigationTabsProps {
  className?: string;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  // Always use username in paths with @ prefix
  // If no username is provided, use the param from the URL or fallback to user's username
  const paramUsername = location.pathname.split("/")[1].replace("@", "");
  const profileUsername = paramUsername || user?.username || "";

  // Define tabs with /@username format
  const tabs: Tab[] = [
    {
      id: "home",
      label: "Home",
      path: `/@${profileUsername}`,
    },
    {
      id: "videos",
      label: "Videos",
      path: `/@${profileUsername}/videos`,
    },
    {
      id: "playlists",
      label: "Playlists",
      path: `/@${profileUsername}/playlists`,
    },
    {
      id: "tweets",
      label: "Tweets",
      path: `/@${profileUsername}/tweets`,
    },
    {
      id: "following",
      label: "Following",
      path: `/@${profileUsername}/following`,
    },
  ];

  // Update active tab logic for @username path format
  const getActiveTab = () => {
    const currentPath = location.pathname;

    // Check if we're on a username profile path with @ prefix
    if (profileUsername && currentPath.includes(`/@${profileUsername}`)) {
      const pathSegments = currentPath.split("/");
      // In /@username/section format, section is at index 2
      const section = pathSegments.length > 2 ? pathSegments[2] : "";

      // If no section (just /@username), it's the home tab
      if (!section) return "home";

      // Otherwise find the tab that matches the section
      const activeTab = tabs.find((tab) => tab.path.endsWith(`/${section}`));
      return activeTab?.id || "home";
    }

    return "home"; // Default
  };

  const activeTabId = getActiveTab();

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className={`mt-2 ${className}`}>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTabId === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => handleTabClick(tab.path)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default NavigationTabs;
