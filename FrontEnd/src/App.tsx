import { useDispatch } from "react-redux";
import { AppDispatch } from "./store/store";
import { useEffect, useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { currentUser, logout } from "./features/auth/authSlice";
import { Toaster } from "react-hot-toast";
import { WatchPage } from "./pages/WatchPage";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./components/auth/ForgotPassword";
import UpdateProfile from "./components/auth/UpdateProfile";
import UserProfile from "./pages/UserProfile";
import VideoTabPage from "./pages/VideoTabPage";
import HeaderNav from "./components/HeaderNav";
import UploadNewVideoPopUp from "./components/video/UploadNewVideoPopUp";
import TweetsTabPage from "./pages/TweetsTabPage";
import LayoutWithSidebar from "./components/LayoutWithSidebar";
import { SidebarProvider } from "./contexts/SidebarContext";

function LayoutWithHeader() {
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <HeaderNav
        onUploadClick={() => setIsUploadPopupOpen(true)}
        onLogoutClick={handleLogout}
      />
      <UploadNewVideoPopUp
        isOpen={isUploadPopupOpen}
        onClose={() => setIsUploadPopupOpen(false)}
      />
      <LayoutWithSidebar>
        <Outlet />
      </LayoutWithSidebar>
    </>
  );
}

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(currentUser());
    }
  }, [dispatch]);

  return (
    <SidebarProvider>
      <Toaster position="top-center" />
      <Routes>
        {/* Public routes without header and sidebar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* All other routes with header and conditional sidebar */}
        <Route element={<LayoutWithHeader />}>
          {/* UnProtected Routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/watch" element={<WatchPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<UserProfile />} />
            <Route path="/edit-profile" element={<UpdateProfile />} />
            <Route path="/videos" element={<VideoTabPage />} />
            <Route path="/tweets" element={<TweetsTabPage />} />
            <Route
              path="/feed/subscriptions"
              element={<div>Subscriptions Page</div>}
            />
            <Route path="/feed/history" element={<div>History Page</div>} />
            <Route path="/feed/playlists" element={<div>Playlists Page</div>} />
            <Route
              path="/feed/liked-videos"
              element={<div>Liked Videos Page</div>}
            />
            <Route path="/feed/videos" element={<div>Liked Videos Page</div>} />
          </Route>
        </Route>
      </Routes>
    </SidebarProvider>
  );
}

export default App;
