import { useState } from "react";
import { ResponseUser } from "../../types/AuthType";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addTweet } from "../../features/tweetSlice";
import { AppDispatch } from "../../store/store";

interface TweetTabProps {
  user: ResponseUser;
}

const TweetTab = ({ user }: TweetTabProps) => {
  const [tweet, setTweet] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  // Handle tweet submission
  const tweetSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTweet = tweet.trim();
    if (!trimmedTweet) {
      toast.error("Tweet cannot be empty!");
      return;
    }
    dispatch(addTweet(trimmedTweet))
      .unwrap()
      .then(() => {
        setTweet("");
        toast.success("Tweet added successfully!");
      })
      .catch((error) => {
        console.error("Error adding tweet:", error);
        toast.error("Failed to add tweet. Please try again.");
      });
  };

  return (
    <div className="flex justify-start min-h-screen bg-gray-100 ">
      <div className="w-full max-w-3xl">
        <div className="flex items-start space-x-3 w-full p-4 bg-white rounded-lg shadow">
          <form
            className="flex-1 flex flex-col space-y-2"
            onSubmit={tweetSubmitHandler}
          >
            <div className="flex items-center space-x-3 mb-2">
              <img
                src={user?.avatar || "/default-avatar.png"}
                alt="userAvatar"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-300"
              />
              <h2 className="text-lg font-semibold text-gray-800">
                {user?.fullName || "User"}
              </h2>
            </div>
            <textarea
              name="tweet"
              id="tweet"
              className="w-full p-2  rounded-lg resize-none focus:outline-none focus:ring-1  focus:ring-blue-500 bg-white "
              rows={2}
              placeholder="Tweet an update to your followers..."
              value={tweet}
              onChange={(e) => setTweet(e.target.value)}
            ></textarea>
            <div className="flex justify-end space-x-2">
              <button
                type="submit"
                className="px-4 py-1.5 text-sm rounded-full bg-blue-600 text-white hover:bg-blue-700 transition font-semibold shadow"
              >
                Tweet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TweetTab;
