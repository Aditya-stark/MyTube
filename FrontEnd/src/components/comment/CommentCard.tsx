import { Comment } from "../../types/CommentType";

const CommentCard = (commentData: Comment) => {
  const { commentContent, createdAt, ownerDetails } = commentData;
  const { username, avatar } = ownerDetails;

  return (
    <div className="flex items-start mb-4">
      <img
        src={avatar}
        alt={`${username}'s avatar`}
        className="w-10 h-10 rounded-full mr-4"
      />
      <div>
        <div className="flex items-center mb-1">
          <span className="font-semibold mr-2">{username}</span>
          <span className="text-gray-500 text-xs">{createdAt} days ago</span>
        </div>
        <div className="text-base">{commentContent}</div>
      </div>
    </div>
  );
};

export default CommentCard;
