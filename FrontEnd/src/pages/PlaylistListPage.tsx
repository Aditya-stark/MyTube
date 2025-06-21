import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";
import { AppDispatch, RootState } from "../store/store";
import { useEffect } from "react";
import { getPlaylistById } from "../features/playlistSlice";
import { format } from "timeago.js";

const PlaylistListPage = () => {
  const [searchParams] = useSearchParams();
  const playlistId = searchParams.get("list");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { currentPlaylist, loading } = useSelector(
    (state: RootState) => state.playlists
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!playlistId) {
      console.error("No playlist ID provided in search params");
      return;
    }
    dispatch(getPlaylistById(playlistId));
  }, [playlistId, dispatch]);

  if (loading || !currentPlaylist) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const firstVideo = currentPlaylist.video && currentPlaylist.video[0];
  const owner = currentPlaylist.owner;

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-base-100 p-4">
      {/* Left: Playlist Info */}
      <div className="md:w-1/4 w-full p-4 flex flex-col items-left bg-gradient-to-b from-blue-600 via-blue-400  to-white rounded-t-2xl ">
        {firstVideo && firstVideo.thumbnail && (
          <img
            src={firstVideo.thumbnail}
            alt="First video thumbnail"
            className="w-full aspect-video rounded-lg object-cover mb-4"
          />
        )}
        <h2 className="text-2xl font-bold mb-2 text-left">
          {currentPlaylist.name}
        </h2>
        <p className="text-base text-gray-500 mb-4 text-left">
          {currentPlaylist.description}
        </p>
        {owner && (
          <div className="flex items-center gap-3 mt-2">
            <img
              src={owner.avatar}
              alt={owner.fullName}
              className="w-10 h-10 rounded-full object-cover border"
            />
            <span className="font-semibold text-lg">{owner.fullName}</span>
          </div>
        )}
      </div>
      {/* Right: Videos List */}
      <div className="md:w-3/4 w-full p-1 flex flex-col">
        {currentPlaylist.video && currentPlaylist.video.length > 0 ? (
          currentPlaylist.video.map((video: any) => (
            <div
              key={video._id}
              className="w-full bg-base-200 rounded-lg p-2 flex gap-4 items-top hover:cursor-pointer hover:bg-gray-200"
              onClick={() => navigate(`/watch?vId=${video._id}`)}
            >
              <div className="flex flex-col items-center justify-center text-gray-500">
                <span>{currentPlaylist.video.indexOf(video) + 1}</span>
              </div>
              {/* Thumbnail Image with time duration*/}
              <div className="relative w-56 min-w-[224px] aspect-video cursor-pointer group">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="absolute h-full w-full object-cover rounded-lg group-hover:brightness-90 transition"
                />
                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                  {Math.floor(video.duration / 60)
                    .toString()
                    .padStart(2, "0")}
                  :
                  {Math.floor(video.duration % 60)
                    .toString()
                    .padStart(2, "0")}
                </div>
              </div>

              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">{video.title}</h3>
                <span className="text-xs text-gray-500 ">
                  {video.owner?.fullName} • {video.views} views • {""}
                  {format(video.createdAt)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400">
            No videos in this playlist.
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistListPage;
