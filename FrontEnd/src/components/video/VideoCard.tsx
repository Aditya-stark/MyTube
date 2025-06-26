import React, { useState, useRef, useEffect } from "react";
import { format } from "timeago.js";
import { useNavigate } from "react-router-dom";
import { MdEdit, MdDelete, MdPlaylistAdd } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import PlaylistPopUp from "../playlist/PlaylistPopUp";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [playlistPopupOpen, setPlaylistPopupOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Function to format the views count
  function formatViews(views: number): string {
    if (views < 1000) return views.toString();
    if (views < 1_000_000) return `${(views / 1000).toFixed(1)}K `;
    if (views < 1_000_000_000) return `${(views / 1_000_000).toFixed(1)}M `;
    return `${(views / 1_000_000_000).toFixed(1)}B `;
  }

  // Handle click outside menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Menu action handlers
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (onEdit) onEdit(video);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (window.confirm("Are you sure you want to delete this video?")) {
      if (onDelete) onDelete(video._id);
    }
  };

  const handleSaveToPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    setPlaylistPopupOpen(true);
  };

  const handleVideoClick = () => {
    navigate(`/watch?vId=${video._id}`);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="bg-gray-100 overflow-visible cursor-pointer mb-1 relative">
      {/* Video Thumbnail*/}
      <div className="relative pb-[56.25%]" onClick={handleVideoClick}>
        <img
          src={video.thumbnail}
          alt={video.title}
          className="absolute h-full w-full object-cover rounded-lg"
        />
        {/* Duration Badge */}
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

      {/* Video Info */}
      <div className="pt-2" onClick={handleVideoClick}>
        <div className="flex items-start justify-between">
          {/* Title */}
          <div className="text-sm font-medium text-gray-900 line-clamp-2 cursor-pointer">
            {video.title}
          </div>
          {/* 3-Dot Menu */}
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              onClick={handleMenuToggle}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              title="More options"
            >
              <BsThreeDotsVertical size={16} className="text-gray-500" />
            </button>

            {menuOpen && (
              <>
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full min-w-[140px] bg-white border border-gray-200 rounded-md shadow-lg z-1">
                  {/* Save to Playlist - Always visible */}
                  <button
                    className="flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors text-gray-700"
                    onClick={handleSaveToPlaylist}
                  >
                    <MdPlaylistAdd size={16} className="mr-2" />
                    Save to Playlist
                  </button>

                  {/* Owner Actions */}
                  {isOwner && (
                    <>
                      {/* Divider */}
                      <hr className="my-1 border-gray-200" />

                      {/* Edit Option */}
                      <button
                        className="flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors text-gray-700"
                        onClick={handleEdit}
                      >
                        <MdEdit size={16} className="mr-2" />
                        Edit Video
                      </button>

                      {/* Delete Option */}
                      <button
                        className="flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors text-red-600"
                        onClick={handleDelete}
                      >
                        <MdDelete size={16} className="mr-2" />
                        Delete Video
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        {/* Views, Date, and Actions */}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
          {/* Views and Date */}
          <span className="flex-1">
            {formatViews(video.views)} views • {format(video.createdAt)}
          </span>
        </div>
      </div>

      {/* Playlist Popup */}
      {playlistPopupOpen && (
        <PlaylistPopUp
          videoId={video._id}
          onClose={() => setPlaylistPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default VideoCard;
