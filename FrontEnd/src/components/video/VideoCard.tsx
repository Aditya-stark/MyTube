import React from "react";
import { format } from "timeago.js"; // For Ago Time Formatting 1 Day Ago
import { useNavigate } from "react-router-dom";
import { MdEdit, MdDelete } from "react-icons/md";

interface VideoCardProps {
  video: {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    duration: number;
    views: number;
    createdAt: string;
  };
  isOwner?: boolean;
  onEdit?: (video: any) => void;
  onDelete?: (videoId: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  isOwner = false,
  onEdit,
  onDelete,
}) => {
  // Function to format the views count
  function formatViews(views: number): string {
    if (views < 1000) return views.toString();
    if (views < 1_000_000) return `${(views / 1000).toFixed(1)}K `;
    if (views < 1_000_000_000) return `${(views / 1_000_000).toFixed(1)}M `;
    return `${(views / 1_000_000_000).toFixed(1)}B `;
  }
  const navigate = useNavigate();

  return (
    <div
      className="bg-gray-100 overflow-hidden cursor-pointer mb-1"
      onClick={() => navigate(`/watch?vId=${video._id}`)}
    >
      <div className="relative pb-[56.25%]">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="absolute h-full w-full object-cover rounded-lg"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 rounded">
          {Math.floor(video.duration / 60)
            .toString()
            .padStart(2, "0")}
          :
          {Math.floor(video.duration % 60)
            .toString()
            .padStart(2, "0")}
        </div>
      </div>
      <div>
        <h3 className="pt-2 text-sm font-medium text-gray-900 line-clamp-2">
          {video.title}
        </h3>
        {/* Align views/date and icons in the same row with space between */}
        <div className="flex items-center justify-between text-xs text-gray-500 ">
          <span>
            {formatViews(video.views)} views • {format(video.createdAt)}
          </span>
          <div className="flex gap-2">
            <button
              title="Edit"
              className="p-1 rounded hover:bg-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                if (onEdit) onEdit(video);
              }}
            >
              <span className="text-gray-400">
                <MdEdit size={16} />
              </span>
            </button>
            <button
              title="Delete"
              className="p-1 rounded hover:bg-gray-200"
              onClick={(e) => {
                e.stopPropagation();
                if (
                  window.confirm("Are you sure you want to delete this video?")
                ) {
                  // Call the delete function
                  if (onDelete) onDelete(video._id);
                }
              }}
            >
              <span className="text-gray-400">
                <MdDelete size={16} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
