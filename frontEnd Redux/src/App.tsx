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
import { onAuthStateChanged } from "firebase/auth";
import { AuthService } from "./services/AuthService";
import apiClient from "./api/apiClient";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    // First check if we have a redirect result from Google Sign-in
    const checkGoogleRedirect = async () => {
      if (localStorage.getItem("googleLoginInProgress")) {
        try {
          const result = await AuthService.checkRedirectResult();
          if (result && result.success) {
            dispatch(googleLoginSuccess(result.data.user));
            navigate("/");
          }
        } catch (error) {
          console.error("Failed to process Google redirect:", error);
        }
      }
    };
    
    checkGoogleRedirect();
    
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Handle Firebase auth state changes
      if (user && localStorage.getItem("googleLoginInProgress")) {
        console.log("Auth state changed, user logged in:", user.email);
        
        try {
          // Extract user data from Google auth result
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

          console.log("Backend response:", response.data);
          
          if (response.data.success) {
            localStorage.setItem("token", response.data.data.accessToken);
            localStorage.setItem("refreshToken", response.data.data.refreshToken);
            
            // Dispatch action to update Redux state
            dispatch(googleLoginSuccess(response.data.data.user));
            
            // Navigate to dashboard
            navigate("/");
            
            // Clear the login progress flag
            localStorage.removeItem("googleLoginInProgress");
          }
        } catch (error) {
          console.error("Error handling Google auth:", error);
          localStorage.removeItem("googleLoginInProgress");
        }
      } else if (localStorage.getItem("token")) {
        // Handle normal token-based auth
        dispatch(currentUser());
      }
    });
    
    return () => unsubscribe();
  }, [dispatch, navigate]);

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
