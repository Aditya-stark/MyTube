import { Comment } from "../../types/CommentType";
import { format } from "timeago.js";
import { useState } from "react";
import { ResponseUser } from "../../types/AuthType";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { deleteComment } from "../../features/commentSlice";
import { toggleCommentLike } from "../../features/likes/likesSlice";
import toast from "react-hot-toast";

interface CommentCardProps {
  commentData: Comment;
  user: ResponseUser;
}

const CommentCard = ({ commentData, user }: CommentCardProps) => {
  const { commentContent, createdAt, ownerDetails, _id: commentId } = commentData;
  const { username, avatar } = ownerDetails;

  const [menuOpen, setMenuOpen] = useState(false);
  const isOwner = user._id === ownerDetails._id;
  const dispatch = useDispatch<AppDispatch>();

  // Get comment like state from Redux
  const { commentLikes, commentLikeCounts } = useSelector(
    (state: RootState) => state.likes
  );

  const isLiked = commentLikes[commentId] || false;
  const likesCount = commentLikeCounts[commentId] || commentData.likesCount || 0;

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
        <div className="flex items-baseline mb-1">
          <span className="font-bold mr-2">{`@${username}`}</span>
          <span className="text-gray-500 text-xs">{format(createdAt)}</span>
        </div>
        <div className="text-base mb-2">{commentContent}</div>
        
        {/* Like Button */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCommentLike}
            className={`flex items-center space-x-1 ${
              isLiked
                ? "text-blue-600"
                : "text-gray-700 hover:text-blue-600"
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
      </div>

      {isOwner && (
        <div className="relative">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <BsThreeDotsVertical size={15} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-20 bg-white border rounded shadow z-10 text-sm">
              <button className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
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
