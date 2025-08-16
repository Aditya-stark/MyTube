import React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "timeago.js";

interface VideoCardWithOwnerDetailProps {
  video: {
    _id: string;
    title: string;
    description?: string;
    thumbnail: string;
    duration: number;
    views: number;
    createdAt: string;
    owner: {
      _id: string;
      fullName: string;
      username: string;
      avatar?: string;
    };
  };
}

function formatViews(views: number): string {
  if (views < 1000) return views.toString();
  if (views < 1_000_000) return `${(views / 1000).toFixed(1)}K`;
  if (views < 1_000_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  return `${(views / 1_000_000_000).toFixed(1)}B`;
}

function formatDuration(duration: number): string {
  const min = Math.floor(duration / 60)
    .toString()
    .padStart(2, "0");
  const sec = Math.floor(duration % 60)
    .toString()
    .padStart(2, "0");
  return `${min}:${sec}`;
}

const VideoCardWithOwnerDetail: React.FC<VideoCardWithOwnerDetailProps> = ({
  video,
}) => {
  const navigate = useNavigate();

  const handleVideoClick = () => {
    navigate(`/watch?vId=${video._id}`);
  };

  const handleOwnerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/channel/${video.owner.username}`);
  };

  return (
    <div
      className="bg-gray-100 overflow-visible cursor-pointer mb-1 relative rounded-lg  hover:shadow-md transition"
      onClick={handleVideoClick}
    >
      {/* Video Thumbnail */}
      <div className="relative pb-[56.25%]">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="absolute h-full w-full object-cover rounded-lg"
        />
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
          {formatDuration(video.duration)}
        </div>
      </div>

      {/* Video Info */}
      <div className="flex pt-2 pb-3 gap-3">
        {/* Avatar */}
        <button
          onClick={handleOwnerClick}
          tabIndex={0}
          aria-label={`Go to ${video.owner.fullName}'s channel`}
          className="flex-shrink-0 flex items-start"
        >
          <img
            src={video.owner.avatar || "/default-avatar.png"}
            alt={video.owner.fullName}
            className="w-8 h-8 rounded-full object-cover"
          />
        </button>

        {/* Title + Channel Info */}
        <div className="flex flex-col flex-1">
          <div className="text-sm md:text-sm xl:text-base font-semibold text-gray-900 line-clamp-2 hover:underline">
            {video.title}
          </div>
          <button
            onClick={handleOwnerClick}
            className="text-xs font-bold text-gray-500 hover:text-gray-700 hover:underline w-fit"
          >
            {video.owner.fullName}
          </button>
          <div className="text-xs text-gray-500">
            {formatViews(video.views)} views • {format(video.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCardWithOwnerDetail;
