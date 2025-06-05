import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice";
import videoSlice from "../features/videos/videoSlice";
import likesSlice from "../features/likes/likesSlice";
import commentSlice from "../features/commentSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    videos: videoSlice,
    likes: likesSlice,
    comments: commentSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
