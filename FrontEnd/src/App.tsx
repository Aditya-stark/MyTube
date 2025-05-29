import { useDispatch } from "react-redux";
import "./App.css";
import { AppDispatch } from "./store/store";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { currentUser } from "./features/auth/authSlice";
import ForgotPassword from "./components/auth/ForgotPassword";
import UpdateProfile from "./components/auth/UpdateProfile";
import { Toaster } from "react-hot-toast";
import UserProfile from "./pages/UserProfile";
import { WatchPage } from "./pages/WatchPage";
import VideoEditBox from "./components/video/VideoEditBox";

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
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Watch Page */}
        <Route path="/watch" element={<WatchPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<UserProfile />} />
          <Route path="/edit-profile" element={<UpdateProfile />} />
          <Route path="/edit-video" element={<VideoEditBox/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
