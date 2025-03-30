import apiClient from "../api/apiClient";
import {
  CurrentUserResponse,
  GoogleAuthData,
  LoginFormData,
  LoginResponse,
  LogoutResponse,
  RegisterFormData,
  RegisterResponse,
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
      console.error("ERROR: ", error);
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
      return null;
    }
  },

  //Password reset
  resetPasswordOTP: async (email: string) => {
    try {
      console.log("emailService", email);
      const res = await apiClient.post("/users/reset-password", {email});

      console.log("res", res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return null;
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
      return null;
    }
  },
};
