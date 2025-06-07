import { Comment } from "../../types/CommentType";
import { format } from "timeago.js";

const CommentCard = (commentData: Comment) => {
  const { commentContent, createdAt, ownerDetails } = commentData;
  const { username, avatar } = ownerDetails;

  return (
    <div className="flex items-center mb-4 ">
      <img
        src={avatar}
        alt={`${username}'s avatar`}
        className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border border-gray-300 mr-3"
      />
      <div>
        <div className="flex items-center mb-1">
          <span className="font-bold mr-2">{`@${username}`}</span>
          <span className="text-gray-500 text-xs">{format(createdAt)}</span>
        </div>
        <div className="text-base">{commentContent}</div>
      </div>
    </div>
  );
};

export default CommentCard;
