import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CurrentUserResponse,
  LoginFormData,
  LoginResponse,
  RegisterFormData,
  RegisterResponse,
  ResponseUser,
  UserState,
} from "../../types/AuthType";
import { AuthService } from "../../services/AuthService";

export const login = createAsyncThunk(
  "auth/login",
  async (loginData: LoginFormData, { rejectWithValue }) => {
    try {
      const res: LoginResponse | null = await AuthService.login(loginData);

      if (res?.success) {
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
      const res: RegisterResponse | null =
        (await AuthService.register(userData)) || null;
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

          if (loginRes?.success) {
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
      const res: CurrentUserResponse | null = await AuthService.currentUser();
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

// GOOGLE LOGIN
export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      return await AuthService.loginWithGoogle();
    } catch (error: any) {
      console.error(
        "Google Login Error:",
        error.response?.data?.message || "Google Login Failed at State"
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
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //Clear error
    clearError: (state) => {
      state.error = null;
    },

    //Google login success
    googleLoginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
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
        state.user = action.payload?.data?.user;
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
      });

    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, googleLoginSuccess } = authSlice.actions;
export default authSlice.reducer;
