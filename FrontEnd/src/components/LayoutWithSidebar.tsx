import React from "react";
import { useLocation } from "react-router";
import SideBarNav from "./SidebarNav";

interface LayoutWithSidebarProps {
  children: React.ReactNode;
}

const LayoutWithSidebar: React.FC<LayoutWithSidebarProps> = ({ children }) => {
  const location = useLocation();
  const hideSidebarPages = [
    "/watch",
    "/login",
    "/register",
    "/forgot-password",
  ];

  const shouldShowSidebar = !hideSidebarPages.includes(location.pathname);

  return (
    <div className="flex">
      {shouldShowSidebar && <SideBarNav />}
      <main
        className={`flex-1 ${
          shouldShowSidebar ? "ml-16" : ""
        } transition-all duration-300`}
      >
        {children}
      </main>
    </div>
  );
};

export default LayoutWithSidebar;