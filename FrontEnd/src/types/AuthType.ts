// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  fullName: string;
  password: string;
  avatar: File | null;
  coverImage: File | null;
}

export interface ResponseUser {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

// Channel Profile Data
export interface ChannelProfileData {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage: string | null;
  watchHistory: string[];
  subscribersCount: number;
  channelSubscribedToCount: number;
  isSubscribed: boolean;
  totalVideosCount: number;
  createdAt: string;
  updatedAt: string;
}

//Response Types

//Register Response (NO TOKEN)
export interface RegisterResponse {
  statusCode: number;
  data: {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    avatar: string;
    coverImage?: string;
    watchHistory: any[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  message: string;
  success: boolean;
}

// Login Response (TOKEN)
export interface LoginResponse {
  statusCode: number;
  success: boolean;
  data?: {
    user: ResponseUser;
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}

//Get Current User
export interface CurrentUserResponse {
  statusCode: number;
  success: boolean;
  data: {
    currentUser: {
      _id: string;
      username: string;
      email: string;
      fullName: string;
      avatar: string;
      coverImage?: string;
      watchHistory: any[];
      createdAt: string;
      updatedAt: string;
    };
  };
  message: string;
}

//Logout
export interface LogoutResponse {
  statusCode: number;
  data: [];
  message: string;
  success: boolean;
}

//User State
export interface UserState {
  user: ResponseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isOTPSent: boolean;
  isPasswordReset: boolean;
  channelProfileData: ChannelProfileData | null;
  watchHistory: string[];
  isWatchHistoryLoading: boolean;
  isWatchHistoryError: string | null;
}

// Error Response
export interface ErrorResponse {
  statusCode: number;
  message: string;
  success: boolean;
}

// Google Auth Data
export interface GoogleAuthData {
  email: string | null;
  fullName: string | null;
  avatar: string | null;
  googleId: string;
  accessToken?: string;
}

// Update User Data
export interface UpdateUserData {
  username?: string;
  email?: string;
  fullName?: string;
}
