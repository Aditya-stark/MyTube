import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VideoCard from "../VideoCard";
import {
  getUserVideos,
  loadMoreUserVideos,
} from "../../../features/videos/videoSlice";

interface VideoTabProps {
  videos: any;
  isLoading: boolean;
  isLoadingMore: boolean;
  setIsUploadPopupOpen: (open: boolean) => void;
}

const VideoTab: React.FC<VideoTabProps> = ({
  videos,
  isLoading,
  isLoadingMore,
  setIsUploadPopupOpen,
}) => {
  const dispatch = useDispatch<any>();
  const hasMoreVideos = useSelector((state: any) => state.videos.hasMoreVideos);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Add sortBy state
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "most-viewed">(
    "latest"
  );

  // Fetch videos when sortBy changes
  useEffect(() => {
    dispatch(getUserVideos({ sortBy }));
  }, [dispatch, sortBy]);

  useEffect(() => {
    if (!hasMoreVideos || isLoadingMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          dispatch(loadMoreUserVideos({ sortBy }));
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [dispatch, hasMoreVideos, isLoadingMore, sortBy]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Videos</h2>
      {/* Sort Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded ${
            sortBy === "latest" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setSortBy("latest")}
        >
          Latest
        </button>
        <button
          className={`px-3 py-1 rounded ${
            sortBy === "most-viewed" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setSortBy("most-viewed")}
        >
          Most Viewed
        </button>
        <button
          className={`px-3 py-1 rounded ${
            sortBy === "oldest" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setSortBy("oldest")}
        >
          Oldest
        </button>
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : videos && videos.videos && videos.videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.videos.map((video: any) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No videos</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't uploaded any videos yet.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setIsUploadPopupOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Upload a video
            </button>
          </div>
        </div>
      )}
      {/* Loading indicator that will trigger more videos when visible */}
      <div ref={loaderRef} style={{ height: "20px" }}>
        {isLoadingMore && "Loading more videos..."}
      </div>
    </div>
  );
};

export default VideoTab;
