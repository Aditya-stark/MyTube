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
import { Toaster } from 'react-hot-toast';
import UserProfile from "./pages/UserProfile";

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

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<UserProfile />} />
          <Route path="/edit-profile" element={<UpdateProfile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
