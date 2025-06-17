import React from "react";
import { useLocation } from "react-router";
import SideBarNav from "./SidebarNav";
import { useSidebar } from "../contexts/SidebarContext"; // Add this import

interface LayoutWithSidebarProps {
  children: React.ReactNode;
}

const LayoutWithSidebar: React.FC<LayoutWithSidebarProps> = ({ children }) => {
  const location = useLocation();
  const { isOpen, isMobile } = useSidebar(); // Get sidebar state

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
        className={`flex-1 transition-all duration-300 ${
          shouldShowSidebar && !isMobile ? (isOpen ? "ml-52" : "ml-16") : ""
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default LayoutWithSidebar;
