import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

  // Define your tabs configuration
  const tabs: Tab[] = [
    {
      id: "home",
      label: "Home",
      path: "/",
    },
    {
      id: "videos",
      label: "My Videos",
      path: "/videos",
    },
    {
      id: "tweets",
      label: "My Tweets",
      path: "/tweets",
    },
  ];

  // Determine active tab based on current path
  const getActiveTab = () => {
    const currentPath = location.pathname;
    const activeTab = tabs.find((tab) => tab.path === currentPath);
    return activeTab?.id || "home";
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
