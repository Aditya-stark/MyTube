import { createContext, useContext, useEffect, useState } from "react";
import { ReactNode } from "react";

type SidebarContextType = {
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  isMobile: boolean;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

type SidebarProviderProps = {
  children: ReactNode;
};

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  //Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsOpen(false); // Close sidebar on mobile
      }
    };

    checkMobile(); // Initial check
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <SidebarContext.Provider
      value={{ isOpen, toggleSidebar, closeSidebar, isMobile }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
