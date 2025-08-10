import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { getLikedVideos } from "../features/likes/likesSlice";
import { useNavigate } from "react-router-dom";
import { format } from "timeago.js";

const FeedLikedVideos: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const { likedVideos, isLoading } = useSelector(
    (state: RootState) => state.likes
  );

  // Redirect guests
  useEffect(() => {
    if (authUser === null) navigate("/login", { replace: true });
  }, [authUser, navigate]);

  // Fetch liked videos once
  useEffect(() => {
    if (authUser && likedVideos.length === 0) {
      dispatch(getLikedVideos());
    }
  }, [authUser, likedVideos.length, dispatch]);

  if (authUser === null) return null; // redirecting

  if (isLoading && likedVideos.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const firstVideo: any = likedVideos[0]?.video;

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-base-100 p-4">
      {/* Left: Summary Info */}
      <div className="md:w-1/4 w-full p-4 flex flex-col items-left bg-gradient-to-b from-blue-600 via-blue-400 to-white rounded-t-2xl">
        {firstVideo?.thumbnail && (
          <img
            src={firstVideo.thumbnail}
            alt={firstVideo.title}
            className="w-full aspect-video rounded-lg object-cover mb-4"
          />
        )}
        <h2 className="text-2xl font-bold mb-2 text-left">Liked Videos</h2>
        <p className="text-base text-gray-600 mb-4 text-left">
          {likedVideos.length} video{likedVideos.length !== 1 && "s"}
        </p>
        {authUser && (
          <div className="flex items-center gap-3 mt-2">
            {authUser.avatar && (
              <img
                src={authUser.avatar}
                alt={authUser.fullName}
                className="w-10 h-10 rounded-full object-cover border"
              />
            )}
            <span className="font-semibold text-lg">{authUser.fullName}</span>
          </div>
        )}
      </div>

      {/* Right: Liked Videos List */}
      <div className="md:w-3/4 w-full p-1 flex flex-col">
        {likedVideos.length > 0 ? (
          likedVideos.map((entry: any, index: number) => {
            const video = entry.video || {};
            return (
              <div
                key={video._id || entry._id || index}
                className="w-full bg-base-200 rounded-lg p-2 flex gap-4 items-top hover:cursor-pointer hover:bg-gray-200"
                onClick={() => navigate(`/watch?vId=${video._id}`)}
              >
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <span>{index + 1}</span>
                </div>
                {/* Thumbnail Image with time duration*/}
                <div className="relative w-56 min-w-[224px] aspect-video cursor-pointer group">
                  {video.thumbnail && (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="absolute h-full w-full object-cover rounded-lg group-hover:brightness-90 transition"
                    />
                  )}
                  {/* Duration Badge */}
                  {typeof video.duration === "number" && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                      {Math.floor(video.duration / 60)
                        .toString()
                        .padStart(2, "0")}
                      :
                      {Math.floor(video.duration % 60)
                        .toString()
                        .padStart(2, "0")}
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold line-clamp-2">
                    {video.title || "Untitled"}
                  </h3>
                  <span className="text-xs text-gray-500 ">
                    {(video.owner?.fullName ||
                      video.owner?.username ||
                      "Unknown") +
                      " • " +
                      (video.views || 0) +
                      " views • " +
                      (video.createdAt ? format(video.createdAt) : "")}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-400">
            You haven't liked any videos yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedLikedVideos;
