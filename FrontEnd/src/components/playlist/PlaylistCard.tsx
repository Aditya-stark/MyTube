import { Playlist } from "../../types/PlaylistType";
import { MdOutlinePlaylistPlay } from "react-icons/md";

interface PlaylistCardProps {
  playlist: Playlist;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-200 flex flex-col w-56 min-w-[12rem] max-w-[14rem]">
      <div className="relative">
        <img
          src={playlist.video[0]?.thumbnail || "/default-playlist-thumb.jpg"}
          alt="Playlist Thumbnail"
          className="w-full h-32 object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <MdOutlinePlaylistPlay className="inline text-lg" />
          {playlist.video.length}{" "}
          {playlist.video.length === 1 ? "Video" : "Videos"}
        </div>
      </div>
      <div className="flex-1 flex flex-col p-3">
        <h3
          className="text-base font-semibold mb-1 truncate"
          title={playlist.name}
        >
          {playlist.name}
        </h3>
        <span className="mt-auto text-blue-600 text-sm font-medium py-1 rounded">
          View Playlist
        </span>
      </div>
    </div>
  );
};

export default PlaylistCard;
