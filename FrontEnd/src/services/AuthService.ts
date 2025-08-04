/**
 * AuthService provides a set of methods for handling user authentication and account management
 * in the frontend application. It make the backend API calls to perform various actions
 * It communicates with the backend API to perform actions such as:
 * - Registering new users (with avatar and optional cover image)
 * - Logging in and logging out users
 * - Fetching the current logged-in user's information
 * - Authenticating users via Google
 * - Handling password reset via OTP (sending and verifying)
 * - Updating user account details, avatar, and cover image
 *
 * This service acts as a central place for all authentication-related API calls,
 * making it easier to manage user sessions and profile updates throughout the app.
 */
import apiClient from "../api/apiClient";
import {
  CurrentUserResponse,
  GoogleAuthData,
  LoginFormData,
  LoginResponse,
  LogoutResponse,
  RegisterFormData,
  RegisterResponse,
  UpdateUserData,
} from "../types/AuthType";

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
      throw error;
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
      if (error.response?.data) {
        return error.response.data as LoginResponse;
      }
      throw error;
    }
  },

  //Logout user
  logout: async () => {
    try {
      const res = await apiClient.post<LogoutResponse>("/users/logout");
      return res.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  },

  //Current user
  currentUser: async () => {
    try {
      const res = await apiClient.get<CurrentUserResponse>(
        "/users/current-user"
      );
      return res.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  },

  //Google login
  googleAuth: async (googleData: GoogleAuthData) => {
    try {
      const res = await apiClient.post<LoginResponse>(
        "/users/google-login",
        googleData
      );

      if (res.data.success) {
        return res.data;
      } else {
        alert("Google login failed. Please try again.");
        return null;
      }
    } catch (error: any) {
      console.error("ERROR: ", error);
      return error;
    }
  },

  //Password reset
  resetPasswordOTP: async (email: string) => {
    try {
      console.log("emailService", email);
      const res = await apiClient.post("/users/reset-password", { email });

      console.log("res", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return error;
    }
  },

  //Password reset verify OTP
  resetPasswordOTPVerify: async (data: {
    email: string;
    otp: string;
    newPassword: string;
  }) => {
    try {
      const res = await apiClient.post("/users/reset-password-verify", data);
      console.log("res", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return error;
    }
  },

  // Update user details
  updateUserAccountDetail: async (userData: UpdateUserData) => {
    try {
      const res = await apiClient.patch("/users/update-details", userData);

      console.log("res", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  },

  //Update User Avatar
  updateUserAvatar: async (avatar: FormData) => {
    try {
      console.log("avatar", avatar);
      const res = await apiClient.patch("/users/update-avatar", avatar);

      if (res.data.success) {
        return res.data;
      } else {
        throw new Error("Failed to update avatar");
      }
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  },

  //Update User Cover Image
  updateUserCoverImage: async (coverImage: FormData) => {
    try {
      const res = await apiClient.patch(
        "/users/update-cover-image",
        coverImage
      );

      if (res.data.success) {
        return res.data;
      } else {
        throw new Error("Failed to update cover image");
      }
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  },

  // Get User By Username (for the other user's profile page)
  getUserByUsername: async (username: string) => {
    try {
      // Always clean username to remove @ if present
      const cleanUsername = username.startsWith("@")
        ? username.substring(1)
        : username;

      const res = await apiClient.get(`/users/${cleanUsername}`);
      if (res.data.success) return res.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  },

  //Get Watch history
  getWatchHistory: async () => {
    try {
      const res = await apiClient.get("/users/watch/history");
      if (res.data.success) return res.data;
      throw new Error("Failed to fetch watch history ");
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  },
};
