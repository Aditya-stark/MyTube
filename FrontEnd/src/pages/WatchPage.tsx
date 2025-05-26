import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import { videoById } from "../features/videos/videoSlice";

export const WatchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("vId");
  const dispatch = useDispatch<AppDispatch>();

  const { currentVideo, isLoading } = useSelector(
    (state: RootState) => state.videos
  );

  useEffect(() => {
    if (videoId) {
      console.log("Fetching video with ID:", videoId);
      dispatch(videoById(videoId));
    }
  }, [videoId, dispatch]);

  return (
    <div>
      <h1>Youtube Watch Page</h1>
      {videoId ? (
        <p>Current Video Title:{currentVideo?.title}</p>
      ) : (
        <p>No video selected.</p>
      )}
    </div>
  );
};
