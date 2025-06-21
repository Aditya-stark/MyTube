import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router";
import { AppDispatch, RootState } from "../store/store";
import { useEffect } from "react";
import { getPlaylistById } from "../features/playlistSlice";

const PlaylistListPage = () => {
  const [searchParams] = useSearchParams();
  const playlistId = searchParams.get("list");
  const dispatch = useDispatch<AppDispatch>();

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
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-base-100">
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
      <div className="md:w-3/4 w-full p-4 flex flex-col gap-2">
        {currentPlaylist.video && currentPlaylist.video.length > 0 ? (
          currentPlaylist.video.map((video: any) => (
            <div
              key={video._id}
              className="w-full bg-base-200 rounded-lg p-4 flex gap-4 items-center"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-32 h-20 object-cover rounded-md"
              />
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold">{video.title}</h3>
                <span className="text-sm text-gray-500">
                  {video.owner?.fullName}
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
