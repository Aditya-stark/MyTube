import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import { videoById } from "../features/videos/videoSlice";
import VideoPlayer from "../components/video/player/VideoPlayer";
import type Player from "video.js/dist/types/player";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { format } from "timeago.js"; // For Ago Time Formatting 1 Day Ago

export const WatchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("vId");
  const dispatch = useDispatch<AppDispatch>();
  const [player, setPlayer] = useState<Player | null>(null);

  const { currentVideo, isLoading } = useSelector(
    (state: RootState) => state.videos
  );

  useEffect(() => {
    if (videoId) {
      console.log("Fetching video with ID:", videoId);
      dispatch(videoById(videoId));
    }
  }, [videoId, dispatch]);

  const handlePlayerReady = (player: Player) => {
    setPlayer(player);
    // Add any event listeners you want here
    player.on("ended", () => {
      console.log("Video ended");
      // You could show related videos or autoplay next
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentVideo && !isLoading) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded">
          <p className="text-sm sm:text-base">
            Video not found or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Video Player Column - Takes 2/3 of the screen on large devices */}
        <div className="lg:col-span-2">
          {currentVideo && (
            <>
              <div className="w-full aspect-video rounded-lg overflow-hidden">
                <VideoPlayer
                  videoUrl={currentVideo.videoFile}
                  thumbnail={currentVideo.thumbnail}
                  onReady={handlePlayerReady}
                />
              </div>

              <div className="mt-3 sm:mt-4">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold line-clamp-2">
                  {currentVideo.title}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 gap-3">
                  {/* User Info and Subscribe Button */}
                  <div className="flex items-center space-x-2 sm:space-x-3 bg-gray-200 p-2 rounded-3xl w-full sm:w-auto">
                    <img
                      src={
                        currentVideo.ownerDetails?.avatar ||
                        "/default-avatar.png"
                      }
                      alt="User Avatar"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm sm:text-md font-bold truncate">
                        {currentVideo.ownerDetails?.fullName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {currentVideo.ownerDetails?.subscriberCount} subscribers
                      </p>
                    </div>
                    <button className="ml-auto px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-bold shadow whitespace-nowrap">
                      Subscribe
                    </button>
                  </div>

                  <div className="flex space-x-3 sm:space-x-4 bg-gray-200 p-2 sm:p-3 rounded-3xl w-full sm:w-auto justify-center sm:justify-start">
                    <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 group">
                      <FaRegThumbsUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-blue-600" />
                      <span className="text-xs sm:text-sm">26 Likes</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 group">
                      <FaRegThumbsDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-blue-600" />
                      <span className="text-xs sm:text-sm">0 Dislike</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 border-t border-gray-300 pt-3 sm:pt-4">
                <div className="mt-3 sm:mt-4 bg-gray-200 p-3 sm:p-4 rounded-2xl">
                  <div className="flex items-center">
                    <span className="text-xs sm:text-sm text-gray-600">
                      {currentVideo.views.toLocaleString()} views •{" "}
                      {format(currentVideo.createdAt)}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-xs sm:text-sm mt-2">
                    {currentVideo.description}
                  </p>

                  <div className="flex items-center space-x-2 sm:space-x-3 bg-gray-300 bg-opacity-50 p-2 rounded-3xl mt-3 sm:mt-4">
                    <img
                      src={
                        currentVideo.ownerDetails?.avatar ||
                        "/default-avatar.png"
                      }
                      alt="User Avatar"
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm sm:text-md font-bold truncate">
                        {currentVideo.ownerDetails?.fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {currentVideo.ownerDetails?.subscriberCount} subscribers
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar - Takes 1/3 of the screen on large devices */}
        <div className="mt-4 lg:mt-0">
          <h2 className="text-md sm:text-lg lg:text-xl font-bold mb-2 sm:mb-4">
            Related Videos
          </h2>
          {/* Here you would map through related videos */}
          <div className="space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm text-gray-500">
              Related videos will appear here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
