import { useDispatch } from "react-redux";
import CommentCard from "../comment/CommentCard";
import { useEffect, useRef, useState } from "react";
import { getMoreComments } from "../../features/commentSlice";
import { AppDispatch } from "../../store/store";

interface CommentComponentProps {
  totalComments: number;
  comments: any[];
  user: any;
  addCommentHandler: (comment: string, reset: () => void) => void;
  hasMoreComments?: boolean;
  isLoadingMore?: boolean;
  videoId?: string;
  lastCommentId?: string;
}

export const CommentComponent = ({
  totalComments,
  comments,
  user, 
  addCommentHandler,
  hasMoreComments = false,
  isLoadingMore = false,
  videoId = "",
  lastCommentId = "",
}: CommentComponentProps) => {
  const [comment, setComment] = useState<string>("");
  const loaderRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  // Handle comment submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = comment.trim();
    if (!trimmed) return;
    addCommentHandler(trimmed, () => setComment(""));
  };

  //Observe the loader for infinite scroll
  useEffect(() => {
    if (!loaderRef.current || !hasMoreComments || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreComments && !isLoadingMore) {
          dispatch(getMoreComments({ videoId, lastCommentId }));
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [dispatch, hasMoreComments, isLoadingMore, videoId, lastCommentId]);

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
              <CommentCard
                key={comment._id}
                commentData={comment}
                user={user}
              />
            ))
          ) : (
            <p className="text-xs sm:text-sm text-gray-500">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>

        {/* Loading More Comments Indicator */}
        {comments.length > 0 && hasMoreComments && (
          <div
            ref={loaderRef}
            className="flex justify-center items-center py-4"
          >
            {isLoadingMore ? (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            ) : (
              <div className="text-gray-500 text-sm">
                Scroll for more comments
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
