import { useDispatch } from "react-redux";
import "./App.css";
import { AppDispatch } from "./store/store";
import { useEffect } from "react";
import { currentUser, googleLoginSuccess } from "./features/auth/authSlice";
import { Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import { auth } from "./utils/firebase.utils";
import apiClient from "./api/apiClient";
import { getRedirectResult } from "firebase/auth";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleAuth = async () => {
      try {
        // Check if we are in the middle of google auth
        if (localStorage.getItem("googleLoginInProgress")) {

          await new Promise((resolve) => setTimeout(resolve, 2000));
          console.log("Google Auth redirect...");

          const result = await getRedirectResult(auth);
          
          console.log("result", result);

          if (result) {
            const user = result.user;

            //Extract user data from Google auth result
            const googleUserData = {
              email: user.email,
              fullName: user.displayName,
              avatar: user.photoURL,
            };

            // Send the user data to the backend
            const response = await apiClient.post(
              "/users/google-login",
              googleUserData
            );

            console.log("response", response);
            // Save the token in the local storage
            if (response.data.success) {
              localStorage.setItem("token", response.data.data.accessToken);
              localStorage.setItem("refreshToken", response.data.data.refreshToken);
            }

            dispatch(googleLoginSuccess(response.data.data.user));

            console.log("Google Auth successful");
            navigate("/");
          }
        }
        localStorage.removeItem("googleLoginInProgress");
      } catch (error) {
        console.error("Google Auth error:", error);
        localStorage.removeItem("googleLoginInProgress");
      }
    };
    // Handle normal token-based auth
    const checkCurrentUser = () => {
      if (localStorage.getItem("token")) {
        dispatch(currentUser());
      }
    };

    // Run the functions
    handleGoogleAuth();
    checkCurrentUser();
  }, [dispatch]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
