import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VideoCard from "../VideoCard";
import VideoEditBox from "../VideoEditBox";
import {
  deleteVideo,
  getVideosByUsername,
  loadMoreUserVideos,
} from "../../../features/videos/videoSlice";
import { AppDispatch, RootState } from "../../../store/store";
import { MdVideoLibrary } from "react-icons/md";
import { PaginatedVideos } from "../../../types/VideoType";

interface VideoTabProps {
  username: string;
  videos: PaginatedVideos | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  setIsUploadPopupOpen: (open: boolean) => void;
}

const VideoTab: React.FC<VideoTabProps> = ({
  username,
  videos,
  isLoading,
  isLoadingMore,
  setIsUploadPopupOpen,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const hasMoreVideos = useSelector((state: any) => state.videos.hasMoreVideos);
  const user = useSelector((state: RootState) => state.auth.user);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Add sortBy state
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "most-viewed">(
    "latest"
  );

  // Edit popup state
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [editVideoData, setEditVideoData] = useState<any>(null);

  // Handler for deleting a video
  const handleDeleteVideo = async (videoId: string) => {
    await dispatch(deleteVideo(videoId));
    dispatch(getVideosByUsername({ username, sortBy })); // Refresh videos after deletion
  };

  // Fetch videos when sortBy changes
  useEffect(() => {
    dispatch(getVideosByUsername({ username, sortBy }));
  }, [dispatch, sortBy, editPopupOpen]);

  useEffect(() => {
    // Only set up observer if we have videos and there are more to load
    if (!hasMoreVideos || isLoadingMore || !videos?.videos?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreVideos && !isLoadingMore) {
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
  }, [dispatch, hasMoreVideos, isLoadingMore, sortBy, videos?.videos?.length]);

  // Handler for edit button
  const handleEditClick = (video: any) => {
    setEditVideoData(video);
    setEditPopupOpen(true);
  };
  const handleCloseEdit = () => {
    setEditPopupOpen(false);
    setEditVideoData(null);
  };

  return (
    // Main container div with minimum height and flexible growth
    <div className="min-h-screen flex flex-col  rounded-lg">
      {/* Header section with title */}
      <h2 className="text-2xl font-bold mb-4 text-gray-800">My Videos</h2>
      {/* Sort buttons section */}
      <div className="flex gap-1 mb-4">
        <button
          className={`px-3 py-1  rounded transition-colors ${
            sortBy === "latest"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
          onClick={() => setSortBy("latest")}
        >
          Latest
        </button>
        <button
          className={`px-3 py-1 rounded transition-colors ${
            sortBy === "most-viewed"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
          onClick={() => setSortBy("most-viewed")}
        >
          Most Viewed
        </button>
        <button
          className={`px-3 py-1 rounded transition-colors ${
            sortBy === "oldest"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          }`}
          onClick={() => setSortBy("oldest")}
        >
          Oldest
        </button>
      </div>
      <div className="flex-grow">
        {isLoading ? (
          <div className="h-full flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : videos && videos.videos && videos.videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {videos.videos.map((video: any) => (
              <VideoCard
                key={video._id}
                video={video}
                isOwner={video.owner._id === user?._id}
                onEdit={handleEditClick}
                onDelete={handleDeleteVideo}
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center items-center py-10">
            <MdVideoLibrary className="h-20 w-20 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No videos
            </h3>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              You haven't uploaded any videos yet. Upload your first video to
              get started.
            </p>
            <button
              onClick={() => setIsUploadPopupOpen(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg
                className="mr-2 h-5 w-5"
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
        )}
      </div>

      {/* Loading more indicator */}
      {videos && videos.videos && videos.videos.length > 0 && hasMoreVideos && (
        <div ref={loaderRef} className="mt-8 py-4 text-center">
          {isLoadingMore ? (
            <div className="flex justify-center items-center space-x-2">
              <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
              <span className="text-gray-600">Loading more videos...</span>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">Scroll for more videos</div>
          )}
        </div>
      )}

      {/* Edit Popup */}
      {editPopupOpen && (
        <VideoEditBox
          isOpen={editPopupOpen}
          onClose={handleCloseEdit}
          editVideoData={editVideoData}
        />
      )}
    </div>
  );
};

export default VideoTab;
