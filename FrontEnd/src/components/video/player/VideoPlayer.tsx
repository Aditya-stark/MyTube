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

      // Enable keyboard shortcuts
      player.ready(() => {
        // Setup keyboard shortcuts
        setupKeyboardShortcuts(player);

        // Set source
        player.src({ src: videoUrl, type: "video/mp4" });
        if (onReady) onReady(player);
      });

      // Ensure poster image fills the container
      videoElement.style.width = "100%";
      videoElement.style.height = "100%";
      videoElement.style.objectFit = "cover";

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

  // Setup keyboard shortcuts function
  const setupKeyboardShortcuts = (player: Player) => {
    // Add keyboard navigation
    player.on("keydown", function (event: KeyboardEvent) {
      // Prevent default behavior for these keys
      if (
        [
          "Space",
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "KeyM",
          "KeyF",
        ].includes(event.code)
      ) {
        event.preventDefault();
      }

      switch (event.code) {
        case "Space":
          // Toggle play/pause
          if (player.paused()) {
            player.play();
          } else {
            player.pause();
          }
          break;

        case "ArrowLeft":
          // Rewind 10 seconds
          const currentTime = player.currentTime();
          if (typeof currentTime === "number") {
            player.currentTime(Math.max(0, currentTime - 10));
          }
          break;

        case "ArrowRight":
          // Forward 10 seconds
          const duration = player.duration();
          const current = player.currentTime();
          if (typeof duration === "number" && typeof current === "number") {
            player.currentTime(Math.min(duration, current + 10));
          }
          break;

        case "ArrowUp":
          // Increase volume by 10%
          if (
            typeof player.volume === "function" &&
            player.volume !== undefined
          ) {
            const currentVolume = player.volume();
            if (typeof currentVolume === "number") {
              player.volume(Math.min(1, currentVolume + 0.1));
            }
          }
          break;

        case "ArrowDown":
          // Decrease volume by 10%
          if (
            typeof player.volume === "function" &&
            player.volume !== undefined
          ) {
            const currentVolume = player.volume();
            if (typeof currentVolume === "number") {
              player.volume(Math.max(0, currentVolume - 0.1));
            }
          }
          break;

        case "KeyM":
          // Toggle mute
          player.muted(!player.muted());
          break;

        case "KeyF":
          // Toggle fullscreen
          if (player.isFullscreen()) {
            player.exitFullscreen();
          } else {
            player.requestFullscreen();
          }
          break;
      }
    });
  };

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
      <div className="shortcut-info absolute bottom-0 right-0 text-white text-xs bg-black bg-opacity-50 p-2 rounded m-2 hidden group-hover:block">
        Keyboard shortcuts: Space (play/pause), ←/→ (seek), ↑/↓ (volume), M
        (mute), F (fullscreen)
      </div>
    </div>
  );
};

export default VideoPlayer;
