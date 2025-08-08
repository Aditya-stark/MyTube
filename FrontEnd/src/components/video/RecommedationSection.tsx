import React from "react";
import { Video } from "../../types/VideoType";

interface Props {
  videos: Video[];
  onVideoClick?: (id: string) => void;
}

const formatViews = (views: number) =>
  views >= 1_000_000
    ? `${(views / 1_000_000).toFixed(1)}M`
    : views >= 1_000
    ? `${(views / 1_000).toFixed(1)}K`
    : views.toString();

const timeAgo = (date: string) => {
  const now = new Date();
  const uploaded = new Date(date);
  const diffMs = now.getTime() - uploaded.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 1) return "Today";
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffDays < 30)
    return `${Math.floor(diffDays / 7)} week${diffDays >= 14 ? "s" : ""} ago`;
  if (diffDays < 365)
    return `${Math.floor(diffDays / 30)} month${diffDays >= 60 ? "s" : ""} ago`;
  return `${Math.floor(diffDays / 365)} year${diffDays >= 730 ? "s" : ""} ago`;
};

const RecommedationSection: React.FC<Props> = ({ videos, onVideoClick }) => (
  <div>
    <h2 className="text-md sm:text-lg lg:text-xl font-bold mb-2 sm:mb-4">
      Up Next
    </h2>
    <div className="space-y-3 sm:space-y-4">
      {videos.length === 0 ? (
        <p className="text-xs sm:text-sm text-gray-500">
          No related videos found.
        </p>
      ) : (
        videos.map((video) => (
          <div
            key={video._id}
            className="flex gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition"
            onClick={() => onVideoClick?.(video._id)}
          >
            <div className="w-32 h-20 flex-shrink-0 rounded overflow-hidden bg-gray-200">
              <img
                src={video.thumbnail || "/default-video-thumb.jpg"}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-600">{video.ownerDetails?.fullName}</p>
              </div>
              <div className="flex gap-2 text-xs text-gray-500 mt-1">
                <span>{formatViews(video.views)} views</span>
                <span>•</span>
                <span>{timeAgo(video.createdAt)}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export default RecommedationSection;
