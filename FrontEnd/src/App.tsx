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
      <Outlet />
    </>
  );
}

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Check if we have a token in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(currentUser());
    }
  }, [dispatch]);

  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        {/* Public routes without header */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* All other routes with header */}
        <Route element={<LayoutWithHeader />}>
          {/* UnProtected Routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/watch" element={<WatchPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<UserProfile />} />
            <Route path="/edit-profile" element={<UpdateProfile />} />
            <Route path="/videos" element={<VideoTabPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
