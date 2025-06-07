import CommentCard from "../comment/CommentCard";
import { useState } from "react";

interface CommentComponentProps {
  totalComments: number;
  comments: any[];
  user: any;
  addCommentHandler: (comment: string, reset: () => void) => void;
}

export const CommentComponent = ({
  totalComments,
  comments,
  user,
  addCommentHandler,
}: CommentComponentProps) => {
  const [comment, setComment] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = comment.trim();
    if (!trimmed) return;
    addCommentHandler(trimmed, () => setComment(""));
  };

  return (
    <div className="mt-4">
      <h2 className="text-md sm:text-lg lg:text-xl font-bold mb-1 sm:mb-2 sm:ml-2">
        {totalComments.toLocaleString()} Comments
      </h2>
      {/* Add Comment */}
      <div className="space-y-3 sm:space-y-4 ">
        <div className="flex items-start space-x-3 w-full p-2">
          <img
            src={user?.avatar || "/default-avatar.png"}
            alt="userAvatar"
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border border-gray-300"
          />
          <form
            className="flex-1 flex flex-col space-y-2"
            onSubmit={handleSubmit}
          >
            <textarea
              name="comment"
              id="comment"
              className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
              rows={2}
              placeholder="Add a public comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="px-4 py-1.5 text-sm rounded-full text-gray-700 hover:bg-gray-300 transition"
                onClick={() => setComment("")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-sm rounded-full bg-blue-600 text-white hover:bg-blue-700 transition font-semibold shadow"
              >
                Comment
              </button>
            </div>
          </form>
        </div>
        
        {/* Comments List */}
        <div className="space-y-3 sm:space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentCard key={comment._id} {...comment} />
            ))
          ) : (
            <p className="text-xs sm:text-sm text-gray-500">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
