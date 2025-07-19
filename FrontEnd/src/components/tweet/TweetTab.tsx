import { useEffect, useState, useRef } from "react";
import { ResponseUser } from "../../types/AuthType";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  addTweet,
  getUserInitialTweets,
  getUserMoreTweets,
} from "../../features/tweetSlice";
import { AppDispatch, RootState } from "../../store/store";
import { Tweet } from "../../types/TweetType";
import TweetCard from "./TweetCard";
import { useParams } from "react-router";
import { getUserByUsername } from "../../features/auth/authSlice";

interface TweetTabProps {
  user: ResponseUser;
}

const TweetTab = ({ user }: TweetTabProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { tweets, loading, hasMore, isLoadingMore, lastTweetId } = useSelector(
    (state: RootState) => state.tweets
  );
  const [tweetContent, setTweetContent] = useState<string>("");
  const loaderRef = useRef<HTMLDivElement>(null);
  const { username } = useParams<{ username?: string }>();
  const cleanUsername = username?.startsWith("@")
    ? username.slice(1)
    : username;

  // Fetch initial tweets when component mounts
  useEffect(() => {
    if (cleanUsername) {
      dispatch(getUserByUsername(cleanUsername));
      dispatch(getUserInitialTweets(cleanUsername))
        .unwrap()
        .catch((error) => {
          console.error("Error fetching initial tweets:", error);
          toast.error("Failed to load tweets. Please try again.");
        });
    }
  }, [dispatch, username, user]);

  // Observer for the loader for infinite scroll
  useEffect(() => {
    if (!loaderRef.current || !hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoadingMore &&
          cleanUsername
        ) {
          dispatch(
            getUserMoreTweets({
              username: cleanUsername,
              lastTweetId: lastTweetId || "",
            })
          );
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loaderRef.current);

    return () => {
      observer.disconnect();
    };
  }, [dispatch, hasMore, isLoadingMore, lastTweetId]);

  // Handle tweet submission - SAME PATTERN AS COMMENTS
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

        if (cleanUsername) {
          dispatch(getUserInitialTweets(cleanUsername));
        }
      })
      .catch((error) => {
        console.error("Error adding tweet:", error);
        toast.error("Failed to add tweet. Please try again.");
      });
  };

  return (
    <div className="flex justify-start min-h-screen">
      <div className="w-full max-w-3xl">
        {/* Tweet Compose Form */}
        {/* User is the Owner than show Form  */}
        {user.username === cleanUsername && (
          <div className="flex items-start space-x-2 w-full p-4 bg-white rounded-md shadow mb-6">
            <img
              src={user?.avatar || "/default-avatar.png"}
              alt="userAvatar"
              className="w-10 h-10 rounded-full object-cover border border-gray-300"
            />
            <form
              className="flex-1 flex flex-col space-y-3"
              onSubmit={tweetSubmitHandler}
            >
              <textarea
                name="tweet"
                id="tweet"
                className="w-full p-3 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-sm min-h-[80px]"
                placeholder="What's happening?"
                value={tweetContent}
                onChange={(e) => setTweetContent(e.target.value)}
              />

              {/*Submit button */}
              <div className="flex justify-between items-center">
                <div className="flex-1" />
                <button
                  type="submit"
                  className="px-6 py-2 text-sm rounded-full bg-blue-600 text-white hover:bg-blue-700 transition font-semibold shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={!tweetContent.trim() || loading}
                >
                  {loading ? "Posting..." : "Tweet"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tweets List */}
        {loading && tweets.length === 0 ? (
          <div className="flex items-center justify-center mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {tweets.length > 0 ? (
              <>
                {tweets.map((tweet: Tweet) => (
                  <TweetCard key={tweet._id} {...tweet} />
                ))}

                {/* Infinite scroll loader */}
                {hasMore && (
                  <div ref={loaderRef} className="flex justify-center py-4">
                    {isLoadingMore ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    ) : (
                      <div className="text-gray-500 text-sm">
                        Load more tweets...
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No tweets yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TweetTab;
