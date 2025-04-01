import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  LoginFormData,
  RegisterFormData,
  ResponseUser,
  UpdateUserData,
  UserState,
} from "../../types/AuthType";
import { AuthService } from "../../services/AuthService";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase.utils";

export const login = createAsyncThunk(
  "auth/login",
  async (loginData: LoginFormData, { rejectWithValue }) => {
    try {
      const res = await AuthService.login(loginData);

      if (res?.success && res?.data) {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        return res;
      } else {
        return rejectWithValue(res?.message || "Incorrect email or password");
      }
    } catch (error: any) {
      console.error(
        "Login Error:",
        error.response?.data?.message || "Login Failed at State"
      );
      return rejectWithValue(
        error.response?.data || "An unknown error occurred"
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/regsiter",
  async (userData: RegisterFormData, { rejectWithValue }) => {
    try {
      const res = await AuthService.register(userData);
      if (!res) {
        return rejectWithValue("Register failed: No response from server");
      }

      if (res?.success) {
        //Auto Login after register
        try {
          const loginRes = await AuthService.login({
            email: userData.email,
            password: userData.password,
          });

          if (loginRes?.success && loginRes?.data) {
            localStorage.setItem("token", loginRes.data.accessToken);
            localStorage.setItem("accessToken", loginRes.data.accessToken);
          }
        } catch (error: any) {
          console.error(
            "Auto Login Error:",
            error.response?.data?.message || "Auto Login Failed at State"
          );
          return rejectWithValue(
            error.response?.data || "An unknown error occurred"
          );
        }
        return res;
      }
    } catch (error: any) {
      console.error(
        "Register Error:",
        error.response?.data?.message || "Register Failed at State"
      );
      return rejectWithValue(
        error.response?.data || "An unknown error occurred"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.logout();
      localStorage.removeItem("token");
    } catch (error: any) {
      console.error(
        "Logout Error:",
        error.response?.data?.message || "Logout Failed at State"
      );
      return rejectWithValue(
        error.response?.data || "An unknown error occurred"
      );
    }
  }
);

export const currentUser = createAsyncThunk(
  "auth/currentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await AuthService.currentUser();
      return res;
    } catch (error: any) {
      console.error(
        "Current User Error:",
        error.response?.data?.message || "Current User Failed at State"
      );
      return rejectWithValue(
        error.response?.data || "An unknown error occurred"
      );
    }
  }
);

export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const crediantial = GoogleAuthProvider.credentialFromResult(result);

      if (!crediantial) {
        return rejectWithValue("Google Sign In failed at State");
      }

      const googleUserData = {
        email: result.user.email,
        fullName: result.user.displayName,
        avatar: result.user.photoURL,
        googleId: result.user.uid,
        accessToken: crediantial.accessToken,
      };

      const response = await AuthService.googleAuth(googleUserData);

      if (response?.success && response?.data) {
        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        return response;
      } else {
        return rejectWithValue(response?.message || "Google Sign In failed");
      }
    } catch (error: any) {
      console.error(
        "Google Sign In Error:",
        error.response?.data?.message || "Google Sign In Failed at State"
      );
      return rejectWithValue(
        error.response.data || "An unknown error occurred"
      );
    }
  }
);

export const passwordResetOTP = createAsyncThunk(
  "auth/passwordResetOTP",
  async (email: string, { rejectWithValue }) => {
    try {
      console.log("email", email);
      const res = await AuthService.resetPasswordOTP(email);
      if (res?.success) {
        return res;
      } else {
        return rejectWithValue(res?.message || "Password Reset OTP failed");
      }
    } catch (error: any) {
      console.error(
        "Password Reset OTP Error:",
        error.response?.data?.message || "Password Reset OTP Failed at State"
      );
      return rejectWithValue(
        error.response?.data || "An unknown error occurred"
      );
    }
  }
);

export const passwordResetOTPVerify = createAsyncThunk(
  "auth/passwordResetOTPVerify",
  async (
    data: { email: string; otp: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await AuthService.resetPasswordOTPVerify(data);

      if (res?.success) {
        return res;
      } else {
        return rejectWithValue(
          res?.message || "Password Reset OTP Verify failed"
        );
      }
    } catch (error: any) {
      console.error(
        "Password Reset OTP Verify Error:",
        error.response?.data?.message ||
          "Password Reset OTP Verify Failed at State"
      );
    }
  }
);

export const updateUserAccountDetails = createAsyncThunk(
  "auth/updateUserAccountDetails",
  async (data: UpdateUserData, { rejectWithValue }) => {
    try {
      const res = await AuthService.updateUserAccountDetail(data);
      if (res?.success) {
        return res;
      } else {
        return rejectWithValue(
          res?.message || "Update User Account Details failed"
        );
      }
    } catch (error: any) {
      console.error(
        "Update User Account Details Error:",
        error.response?.data?.message ||
          "Update User Account Details Failed at State"
      );
      return rejectWithValue(
        error.response?.data || "An unknown error occurred"
      );
    }
  }
);

const initialState: UserState = {
  user: null as ResponseUser | null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isOTPSent: false,
  isPasswordReset: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload?.data?.user || null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      //Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload?.data || null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      //Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      //CurrentUser
      .addCase(currentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(currentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload?.data?.currentUser || null;
      })
      .addCase(currentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(signInWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload?.data?.user || null;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      //Password Reset OTP
      .addCase(passwordResetOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(passwordResetOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.isOTPSent = true;
      })
      .addCase(passwordResetOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.isOTPSent = false;
        state.error = action.payload as string;
      })
      // Password Reset Verify
      .addCase(passwordResetOTPVerify.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(passwordResetOTPVerify.fulfilled, (state) => {
        state.isLoading = false;
        state.isPasswordReset = true;
      })
      .addCase(passwordResetOTPVerify.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      //Update User Account Details
      .addCase(updateUserAccountDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserAccountDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload?.data || null;
      })
      .addCase(updateUserAccountDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
