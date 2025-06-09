import { Comment } from "../../types/CommentType";
import { format } from "timeago.js";
import { useState } from "react";
import { ResponseUser } from "../../types/AuthType";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { deleteComment } from "../../features/commentSlice";
import toast from "react-hot-toast";

interface CommentCardProps {
  commentData: Comment;
  user: ResponseUser;
}

const CommentCard = ({ commentData, user }: CommentCardProps) => {
  const { commentContent, createdAt, ownerDetails } = commentData;
  const { username, avatar } = ownerDetails;

  const [menuOpen, setMenuOpen] = useState(false);
  const isOwner = user._id === ownerDetails._id;
  const dispatch = useDispatch<AppDispatch>();

  const deleteCommentHandler = () => {
    dispatch(deleteComment(commentData._id))
      .unwrap()
      .then(() => {
        toast.success("Comment deleted successfully");
        setMenuOpen(false);
      })
      .catch((error) => {
        console.error("Failed to delete comment:", error);
      });
  };

  return (
    <div className="flex items-center mb-4 ">
      <img
        src={avatar}
        alt={`${username}'s avatar`}
        className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border border-gray-300 mr-3"
      />
      <div>
        <div className="flex items-baseline mb-1">
          <span className="font-bold mr-2">{`@${username}`}</span>
          <span className="text-gray-500 text-xs">{format(createdAt)}</span>
        </div>
        <div className="text-base">{commentContent}</div>
      </div>

      {isOwner && (
        <div className="ml-auto relative">
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
