import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import { videoById } from "../features/videos/videoSlice";
import VideoPlayer from "../components/video/player/VideoPlayer";
import type Player from 'video.js/dist/types/player';

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
    player.on('ended', () => {
      console.log('Video ended');
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
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Video not found or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player Column - Takes 2/3 of the screen on large devices */}
        <div className="lg:col-span-2">
          {currentVideo && (
            <>
              <VideoPlayer
                videoUrl={currentVideo.videoFile}
                thumbnail={currentVideo.thumbnail}
                onReady={handlePlayerReady}
              />
              
              <div className="mt-4">
                <h1 className="text-2xl font-bold">{currentVideo.title}</h1>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <span className="text-gray-600">{currentVideo.views} views • {new Date(currentVideo.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      <span>Like</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2" />
                      </svg>
                      <span>Dislike</span>
                    </button>
                    
                  </div>
                </div>
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-3">
                  {currentVideo.owner?.avatar && (
                    <img 
                      src={currentVideo.owner.avatar} 
                      alt={currentVideo.owner.username} 
                      className="h-10 w-10 rounded-full"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{currentVideo.owner?.username}</h3>
                    <button className="mt-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-sm font-medium rounded-full">
                      Subscribe
                    </button>
                  </div>
                </div>
                <div className="mt-4 bg-gray-50 p-4 rounded-md">
                  <p className="whitespace-pre-wrap">{currentVideo.description}</p>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Sidebar - Takes 1/3 of the screen on large devices */}
        <div className="mt-6 lg:mt-0">
          <h2 className="text-xl font-bold mb-4">Related Videos</h2>
          {/* Here you would map through related videos */}
          <div className="space-y-4">
            <p className="text-gray-500">Related videos will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
