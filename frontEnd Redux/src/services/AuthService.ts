import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import apiClient from "../api/apiClient";
import {
  CurrentUserResponse,
  LoginFormData,
  LoginResponse,
  LogoutResponse,
  RegisterFormData,
  RegisterResponse,
} from "../types/AuthType";
import { auth } from "../utils/firebase.utils";

export const AuthService = {
  //Register user
  register: async (userData: RegisterFormData) => {
    try {
      const formData = new FormData();
      formData.append("username", userData.username);
      formData.append("email", userData.email);
      formData.append("fullName", userData.fullName);
      formData.append("password", userData.password);
      if (!userData.avatar) {
        alert("Avatar is required");
        return;
      }
      formData.append("avatar", userData.avatar);
      if (userData.coverImage) {
        formData.append("coverImage", userData.coverImage);
      }

      const res = await apiClient.post<RegisterResponse>(
        "/users/register",
        formData
      );

      console.log("res", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return null;
    }
  },
  //Login user
  login: async (loginData: LoginFormData) => {
    try {
      const res = await apiClient.post<LoginResponse>(
        "/users/login",
        loginData
      );

      return res.data;
    } catch (error: any) {
      console.error("ERROR: ", error)
      return null;
    }
  },

  //Logout user
  logout: async () => {
    try {
      const res = await apiClient.post<LogoutResponse>("/users/logout");
      console.log("res", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return null;
    }
  },

  //Current user
  currentUser: async () => {
    try {
      const res = await apiClient.get<CurrentUserResponse>(
        "/users/current-user"
      );
      console.log("res", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return null;
    }
  },

  // Google Login
    // Google Login
  loginWithGoogle: async () => {
    console.log("Starting Google Login flow");
    try {
      const provider = new GoogleAuthProvider();
      
      // Add scopes
      provider.addScope("profile");
      provider.addScope("email");
      
      // Add custom parameters for better UX
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      console.log("Initiating Google auth");
  
      // Store a flag that we're attempting authentication
      localStorage.setItem("googleLoginInProgress", "true");
      
      // Use redirect method as the primary approach to avoid popup issues
      await signInWithRedirect(auth, provider);
      
      // This code won't execute immediately due to the redirect
      return null;
    } catch (error) {
      console.error("Google auth error:", error);
      localStorage.removeItem("googleLoginInProgress");
      throw error;
    }
  },  
  // New method to check redirect result on page load
  checkRedirectResult: async () => {
    try {
      console.log("Checking for redirect result");
      const result = await getRedirectResult(auth);
      
      if (result) {
        const user = result.user;
        console.log("Google auth successful via redirect", user.email);
        
        // Extract user data
        const googleUserData = {
          email: user.email,
          fullName: user.displayName,
          avatar: user.photoURL,
        };
        
        // Send to backend
        const response = await apiClient.post("/users/google-login", googleUserData);
        
        if (response.data.success) {
          localStorage.setItem("token", response.data.data.accessToken);
          localStorage.setItem("refreshToken", response.data.data.refreshToken);
        }
        
        localStorage.removeItem("googleLoginInProgress");
        return response.data;
      }
      
      // Check if the login attempt is too old (5 minutes) and clear it
      const loginTimestamp = localStorage.getItem("googleLoginInProgress");
      if (loginTimestamp && !isNaN(Number(loginTimestamp))) {
        const now = Date.now();
        if (now - Number(loginTimestamp) > 5 * 60 * 1000) {
          console.log("Login attempt expired");
          localStorage.removeItem("googleLoginInProgress");
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error checking redirect result:", error);
      localStorage.removeItem("googleLoginInProgress");
      return null;
    }
  }
};
