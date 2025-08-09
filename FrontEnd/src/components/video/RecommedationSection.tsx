import React from "react";
import { format } from "timeago.js";

interface VideoItem {
  _id: string;
  thumbnail?: string;
  title: string;
  views: number;
  createdAt: string;
  owner?: {
    fullName?: string;
    username?: string;
    _id?: string;
  };
}

interface Props {
  videos: VideoItem[];
  onVideoClick?: (id: string) => void;
}

const formatViews = (views: number) =>
  views >= 1_000_000
    ? `${(views / 1_000_000).toFixed(1)}M`
    : views >= 1_000
    ? `${(views / 1_000).toFixed(1)}K`
    : views.toString();

const RecommedationSection: React.FC<Props> = ({ videos, onVideoClick }) => (
  <div>
    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-5">
      Up Next
    </h2>
    <div className="space-y-4 sm:space-y-6">
      {videos.length === 0 ? (
        <p className="text-sm sm:text-base text-gray-500">
          No related videos found.
        </p>
      ) : (
        videos.map((video) => (
          <div
            key={video._id}
            className="flex gap-2 cursor-pointer hover:bg-gray-100 rounded-xl "
            onClick={() => onVideoClick?.(video._id)}
          >
            <div className="w-44 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
              <img
                src={video.thumbnail || "/default-video-thumb.jpg"}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col  flex-1">
              <div>
                <h3 className="text-base font-bold text-gray-900 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600">{video.owner?.fullName}</p>
              </div>
              <div className="flex gap-1 text-xs text-gray-500 mt-2">
                <span>{formatViews(video.views)} views</span>
                <span>•</span>
                <span>{format(video.createdAt)}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export default RecommedationSection;
