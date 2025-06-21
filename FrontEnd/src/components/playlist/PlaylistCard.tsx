import { useNavigate } from "react-router";
import { Playlist } from "../../types/PlaylistType";
import { MdOutlinePlaylistPlay } from "react-icons/md";

interface PlaylistCardProps {
  playlist: Playlist;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  const navigate = useNavigate();
  const handlePlaylistClick = () => {
    navigate(`/playlist?list=${playlist._id}`);
  };

  return (
    <div
      className="bg-white shadow-lg rounded-lg overflow-hidden hover:cursor-pointer group flex flex-col w-full min-w-0 max-w-full"
      onClick={handlePlaylistClick}
    >
      <div className="relative">
        <img
          src={playlist.video[0]?.thumbnail || "/default-playlist-thumb.jpg"}
          alt="Playlist Thumbnail"
          className="w-full h-object-cover group-hover:brightness-50"
        />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <MdOutlinePlaylistPlay className="inline text-lg" />
          {playlist.video.length}{" "}
          {playlist.video.length === 1 ? "Video" : "Videos"}
        </div>
      </div>
      <div className="flex-1 flex flex-col p-2">
        <h3
          className="text-sm sm:text-base font-semibold"
          title={playlist.name}
        >
          {playlist.name}
        </h3>
        <span className="mt-auto text-blue-600 text-xs sm:text-sm font-medium rounded">
          View Playlist
        </span>
      </div>
    </div>
  );
};

export default PlaylistCard;
