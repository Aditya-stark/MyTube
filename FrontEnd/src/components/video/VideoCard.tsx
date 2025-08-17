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
    description?: string;
    thumbnail: string;
    duration: number;
    views: number;
    createdAt: string;
    owner?: {
      _id?: string;
      fullName?: string;
      username?: string;
      avatar?: string;
    };
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

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

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

  const handleOwnerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (video.owner?.username) navigate(`/channel/${video.owner.username}`);
  };

  return (
    <div
      className="bg-gray-100 overflow-visible cursor-pointer mb-1 relative rounded-lg "
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

      {/* Video Info - same design as VideoCardWithOwnerDetail */}
      <div className="flex pt-2 pb-3 gap-3 items-start">
        {/* Avatar - render only if viewer is NOT the owner */}
        {!isOwner && (
          <button
            onClick={handleOwnerClick}
            tabIndex={0}
            aria-label={`Go to ${video.owner?.fullName || "channel"}'s channel`}
            className="flex-shrink-0 flex items-start"
          >
            <img
              src={video.owner?.avatar || "/default-avatar.png"}
              alt={video.owner?.fullName || "channel"}
              className="w-8 h-8 rounded-full object-cover"
            />
          </button>
        )}

        {/* Title + Channel Info */}
        <div className="flex flex-col flex-1">
          <div className="text-sm md:text-sm xl:text-base font-semibold text-gray-900 line-clamp-2 hover:underline">
            {video.title}
          </div>

          {/* fullName - render only if viewer is NOT the owner */}
          {!isOwner && (
            <button
              onClick={handleOwnerClick}
              className="text-xs font-bold text-gray-500 hover:text-gray-700 hover:underline w-fit mt-1"
            >
              {video.owner?.fullName || "Unknown"}
            </button>
          )}

          <div className="text-xs text-gray-500 mt-1">
            {formatViews(video.views)} views • {format(video.createdAt)}
          </div>
        </div>

        {/* 3-dot menu */}
        <div ref={menuRef} className="relative ml-2">
          <button
            onClick={handleMenuToggle}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors text-gray-600"
            title="More options"
            aria-label="More options"
          >
            <BsThreeDotsVertical size={16} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full min-w-[160px] bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <button
                className="flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors text-gray-700"
                onClick={handleSaveToPlaylist}
              >
                <MdPlaylistAdd size={16} className="mr-2" />
                Save to Playlist
              </button>

              {isOwner && (
                <>
                  <hr className="my-1 border-gray-200" />
                  <button
                    className="flex items-center w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors text-gray-700"
                    onClick={handleEdit}
                  >
                    <MdEdit size={16} className="mr-2" />
                    Edit Video
                  </button>
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
          )}
        </div>
      </div>

      {/* Playlist Popup */}
      {playlistPopupOpen && (
        <div onClick={(e) => e.stopPropagation()}>
          <PlaylistPopUp
            videoId={video._id}
            onClose={() => setPlaylistPopupOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default VideoCard;
