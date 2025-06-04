import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice";
import videoSlice from "../features/videos/videoSlice";
import likesSlice from "../features/likes/likesSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    videos: videoSlice,
    likes: likesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
