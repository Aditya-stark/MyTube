import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import type Player from "video.js/dist/types/player";
import "./VideoPlayer.css";

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail: string;
  autoplay?: boolean;
  onReady?: (player: Player) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  thumbnail,
  autoplay = true,
  onReady,
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  // Initialize Video.js ONCE
  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered", "video-js");
      videoRef.current.appendChild(videoElement);

      const player = videojs(videoElement, {
        controls: true,
        autoplay,
        fluid: true,
        responsive: true,
        poster: thumbnail || "",
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        controlBar: {
          skipButtons: {
        forward: 10,
        backward: 10,
          },
        },
      });

      // Ensure poster image fills the container
      videoElement.style.width = "100%";
      videoElement.style.height = "100%";
      videoElement.style.objectFit = "cover";

      // Set source after player is ready
      player.ready(() => {
        player.src({ src: videoUrl, type: "video/mp4" });
        if (onReady) onReady(player);
      });

      playerRef.current = player;
    }

    // Cleanup on unmount
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.innerHTML = "";
      }
    };
  }, []); // Only run once

  // Update source and poster when props change
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.src({ src: videoUrl, type: "video/mp4" });
      playerRef.current.poster(thumbnail);
    }
  }, [videoUrl, thumbnail]);

  return (
    <div className="w-full relative overflow-hidden bg-black rounded-lg">
      <div ref={videoRef} className="w-full aspect-video" data-vjs-player />
    </div>
  );
};

export default VideoPlayer;
