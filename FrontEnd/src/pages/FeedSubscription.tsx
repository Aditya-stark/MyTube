import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import VideoCard from "../components/video/VideoCard";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSubscribedVideos } from "../features/videos/videoSlice";

const FeedSubscription = () => {
  const { subscribedVideos, subscribedVideosLoading } = useSelector(
    (state: RootState) => state.videos
  );
  const authUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Redirect guest users
  useEffect(() => {
    if (authUser === null) {
      navigate("/login", { replace: true });
    }
  }, [authUser, navigate]);

  useEffect(() => {
    if (authUser) {
      dispatch(getSubscribedVideos());
    }
  }, [authUser, dispatch]);

  if (authUser === null) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-8xl mx-0 sm:mx-5 lg:mx-10 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="pt-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Subscribed Channel Videos
            </h2>
            {subscribedVideosLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
              </div>
            ) : subscribedVideos && subscribedVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {subscribedVideos.map((video: any) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 mt-10">
                No videos found from your subscriptions.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedSubscription;
