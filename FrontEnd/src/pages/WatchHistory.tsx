import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import HistoryVideoCard from "../components/video/HistoryVideoCard";
import { getWatchHistory } from "../features/auth/authSlice"; // Adjust path if needed

const WatchHistory = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { watchHistory, isWatchHistoryLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  console.log("Watch History:", watchHistory);

  useEffect(() => {
    dispatch(getWatchHistory());
  }, [dispatch]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <span>Watch History</span>
      </h2>
      {isWatchHistoryLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : watchHistory && watchHistory.length > 0 ? (
        <div className="flex flex-col">
          {watchHistory.map((video: any) => (
            <HistoryVideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center mt-10">
          No videos in your watch history yet.
        </div>
      )}
    </div>
  );
};

export default WatchHistory;
