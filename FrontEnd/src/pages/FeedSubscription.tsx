import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getSubscribedVideos } from "../features/videos/videoSlice";
import VideoCardWithOwnerDetail from "../components/video/VideoCardWithOwnerDetail";

const FeedSubscription = () => {
  const {
    subscribedVideos,
    subscribedVideosLoading,
    subscribedHasMore,
    subscribedLastVideoId,
    subscribedIsLoadingMore,
  } = useSelector((state: RootState) => state.videos);
  const authUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const loaderRef = useRef<HTMLDivElement>(null);

  // Redirect guest users
  useEffect(() => {
    if (authUser === null) {
      navigate("/login", { replace: true });
    }
  }, [authUser, navigate]);

  // Initial fetch
  useEffect(() => {
    if (authUser) {
      dispatch(getSubscribedVideos({ limit: 8, lastVideoId: null }));
    }
  }, [authUser, dispatch]);

  // Infinite scroll observer
  useEffect(() => {
    if (
      !subscribedHasMore ||
      subscribedIsLoadingMore ||
      !subscribedVideos?.length
    )
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          subscribedHasMore &&
          !subscribedIsLoadingMore
        ) {
          dispatch(
            getSubscribedVideos({
              limit: 8,
              lastVideoId: subscribedLastVideoId,
            })
          );
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
    }, [
    dispatch,
    subscribedHasMore,
    subscribedIsLoadingMore,
    subscribedLastVideoId,
    subscribedVideos?.length,
  ]);

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
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {subscribedVideos.map((video: any) => (
                    <VideoCardWithOwnerDetail key={video._id} video={video} />
                  ))}
                </div>
                {subscribedHasMore && (
                  <div ref={loaderRef} className="mt-8 py-4 text-center">
                    {subscribedIsLoadingMore ? (
                      <div className="flex justify-center items-center space-x-2">
                        <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
                        <span className="text-gray-600">Loading more videos...</span>
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">Scroll for more videos</div>
                    )}
                  </div>
                )}
              </>
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
