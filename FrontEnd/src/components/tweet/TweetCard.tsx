import { BsThreeDotsVertical } from "react-icons/bs";
import { Tweet } from "../../types/TweetType";
import { format } from "timeago.js";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { deleteTweet, updateTweet } from "../../features/tweetSlice";

const TweetCard = (tweet: Tweet) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(tweet.content);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  // Handle click outside menu to close it
  useEffect(() => {
    const handleClickOuside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOuside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOuside);
    };
  }, [menuOpen]);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = editText.trim();
    if (!trimmedText) {
      toast.error("Tweet cannot be empty!");
      return;
    }
    dispatch(updateTweet({ tweetId: tweet._id, content: trimmedText }))
      .unwrap()
      .then(() => {
        setIsEditing(false);
        setEditText(trimmedText);
        toast.success("Tweet updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating tweet:", error);
        toast.error("Failed to update tweet. Please try again.");
      });
  };

  const deleteTweetHandler = () => {
    dispatch(deleteTweet(tweet._id))
      .unwrap()
      .then(() => {
        toast.success("Tweet deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting tweet:", error);
        toast.error("Failed to delete tweet. Please try again.");
      });
  };

  return (
    <div className="space-y-4">
      <div
        key={tweet._id}
        className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition"
      >
        <div className="flex items-start space-x-3 mb-2">
          <img
            src={tweet.owner.avatar || "/default-avatar.png"}
            alt="userAvatar"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-300"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-0.5">
              <h2 className="text-sm font-bold text-gray-800">
                {tweet.owner.fullName || "User"}
              </h2>
              <span className="text-xs text-gray-500">
                {format(tweet.createdAt)}
              </span>
            </div>
            {isEditing ? (
              <form
                className="flex-1 flex flex-col space-y-1"
                onSubmit={submitHandler}
              >
                <textarea
                  name="tweet"
                  id="tweet"
                  className="w-full p-2 rounded-md resize-none border-1 border-gray-300 focus:border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                  rows={2}
                  placeholder="Edit your tweet..."
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                ></textarea>
                <div className="flex justify-end m-2 space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 text-xs rounded-full text-grey-600 hover:bg-gray-200 transition font-semibold hover:shadow"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs rounded-full bg-blue-600 text-white hover:bg-blue-700 transition font-semibold shadow"
                  >
                    Update
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-gray-700">{tweet.content}</p>
            )}
          </div>
          {!isEditing && (
            <div className="flex-1 flex justify-end">
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="p-1 rounded-full hover:bg-gray-200"
                >
                  <BsThreeDotsVertical size={15} />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-1 w-20 bg-white border rounded shadow z-10 text-sm">
                    <button
                      className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                      onClick={() => {
                        setIsEditing(true);
                        setMenuOpen(false);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-red-600"
                      onClick={deleteTweetHandler}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TweetCard;
