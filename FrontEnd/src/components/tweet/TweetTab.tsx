import { useEffect, useState } from "react";
import { ResponseUser } from "../../types/AuthType";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addTweet, getUserInitialTweets } from "../../features/tweetSlice";
import { AppDispatch, RootState } from "../../store/store";
import { Tweet } from "../../types/TweetType";
import TweetCard from "./TweetCard";

interface TweetTabProps {
  user: ResponseUser;
}

const TweetTab = ({ user }: TweetTabProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { tweets, loading } = useSelector((state: RootState) => state.tweets);
  const [tweetContent, setTweetContent] = useState<string>("");

  // Fetch initial tweets when component mounts
  useEffect(() => {
    dispatch(getUserInitialTweets())
      .unwrap()
      .catch((error) => {
        console.error("Error fetching initial tweets:", error);
        toast.error("Failed to load tweets. Please try again.");
      });
  }, [dispatch]);

  // Handle tweet submission
  const tweetSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTweet = tweetContent.trim();
    if (!trimmedTweet) {
      toast.error("Tweet cannot be empty!");
      return;
    }
    dispatch(addTweet(trimmedTweet))
      .unwrap()
      .then(() => {
        setTweetContent("");
        toast.success("Tweet added successfully!");
      })
      .catch((error) => {
        console.error("Error adding tweet:", error);
        toast.error("Failed to add tweet. Please try again.");
      });
  };

  return (
    <div className="flex justify-start min-h-screen ">
      <div className="w-full max-w-3xl">
        <div className="flex items-start space-x-2 w-full p-2 bg-white rounded-md shadow">
          <form
            className="flex-1 flex flex-col space-y-1"
            onSubmit={tweetSubmitHandler}
          >
            <div className="flex items-center space-x-2 mb-1">
              <img
                src={user?.avatar || "/default-avatar.png"}
                alt="userAvatar"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-300"
              />
              <h2 className="text-base font-bold text-gray-800">
                {user?.fullName || "User"}
              </h2>
            </div>
            <textarea
              name="tweet"
              id="tweet"
              className="w-full p-2 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
              rows={2}
              placeholder="Tweet an update to your followers..."
              value={tweetContent}
              onChange={(e) => setTweetContent(e.target.value)}
            ></textarea>
            <div className="flex justify-end m-2">
              <button
                type="submit"
                className="px-4 py-2 text-xs rounded-full bg-blue-600 text-white hover:bg-blue-700 transition font-semibold shadow"
              >
                Tweet
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="flex items-center justify-center mt-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4 mt-6">
            {tweets.map((tweet: Tweet) => (
              <TweetCard key={tweet._id} {...tweet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TweetTab;
