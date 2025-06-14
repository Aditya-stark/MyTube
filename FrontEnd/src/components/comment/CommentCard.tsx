import { Comment } from "../../types/CommentType";
import { format } from "timeago.js";
import { useState, useRef, useEffect } from "react";
import { ResponseUser } from "../../types/AuthType";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { deleteComment, editComment } from "../../features/commentSlice";
import { toggleCommentLike } from "../../features/likes/likesSlice";
import toast from "react-hot-toast";

interface CommentCardProps {
  commentData: Comment;
  user: ResponseUser;
}

const CommentCard = ({ commentData, user }: CommentCardProps) => {
  const {
    commentContent,
    createdAt,
    ownerDetails,
    _id: commentId,
  } = commentData;
  const { username, avatar } = ownerDetails;
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(commentContent);
  const isOwner = user._id === ownerDetails._id;
  const dispatch = useDispatch<AppDispatch>();
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Get comment like state from Redux
  const { commentLikes, commentLikeCounts } = useSelector(
    (state: RootState) => state.likes
  );

  const isLiked = commentLikes[commentId] || false;
  const likesCount =
    commentLikeCounts[commentId] || commentData.likesCount || 0;
  const deleteCommentHandler = () => {
    dispatch(deleteComment(commentId))
      .unwrap()
      .then(() => {
        toast.success("Comment deleted successfully");
        setMenuOpen(false);
      })
      .catch((error) => {
        console.error("Failed to delete comment:", error);
      });
  };

  const handleEditComment = () => {
    setIsEditing(true);
    setMenuOpen(false);
  };

  const handleSaveEdit = () => {
    if (editText.trim() === "") {
      toast.error("Comment cannot be empty");
      return;
    }

    dispatch(
      editComment({
        editCommentId: commentId,
        editComment: editText.trim(),
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Comment updated successfully");
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Failed to update comment:", error);
        toast.error("Failed to update comment");
      });
  };

  const handleCancelEdit = () => {
    setEditText(commentContent); // Reset to original content
    setIsEditing(false);
  };

  const handleCommentLike = () => {
    dispatch(toggleCommentLike(commentId))
      .unwrap()
      .catch((error) => {
        console.error("Error toggling comment like:", error);
        toast.error("Failed to toggle like");
      });
  };

  return (
    <div className="flex items-start mb-4 space-x-3">
      <img
        src={avatar}
        alt={`${username}'s avatar`}
        className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border border-gray-300"
      />
      <div className="flex-1">
        {" "}
        <div className="flex items-baseline mb-1">
          <span className="font-bold mr-2">{`@${username}`}</span>
          <span className="text-gray-500 text-xs">{format(createdAt)}</span>
        </div>
        {/* Comment Content - Show input when editing, text when not */}
        {isEditing ? (
          <div className="mb-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              maxLength={500}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="text-base mb-2">{commentContent}</div>
        )}
        {/* Like Button */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCommentLike}
            className={`flex items-center space-x-1 ${
              isLiked ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
            } group`}
          >
            {isLiked ? (
              <FaThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              <FaRegThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 group-hover:text-blue-600" />
            )}
            <span className="text-xs sm:text-sm">{likesCount}</span>
          </button>
        </div>
      </div>{" "}
      {isOwner && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <BsThreeDotsVertical size={15} />
          </button>{" "}
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-20 bg-white border rounded shadow z-10 text-sm">
              <button
                className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                onClick={handleEditComment}
              >
                Edit
              </button>
              <button
                className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-red-600"
                onClick={deleteCommentHandler}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
