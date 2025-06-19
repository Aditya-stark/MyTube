import { useState } from "react";
import { IoClose } from "react-icons/io5";
import PlaylistSelection from "./PlaylistSelection";
import NewPlaylist from "./NewPlaylist";

interface PlaylistPopUpProps {
  videoId: string;
  onClose: () => void;
}

const PlaylistPopUp: React.FC<PlaylistPopUpProps> = ({ videoId, onClose }) => {
  const [isNewPlaylist, setIsNewPlaylist] = useState(false);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-white rounded-xl shadow-lg w-72 sm:w-80 p-4 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          <IoClose size={20} />
        </button>
        {!isNewPlaylist ? (
          <PlaylistSelection
            setIsNewPlaylist={setIsNewPlaylist}
            videoId={videoId}
          />
        ) : (
          <NewPlaylist videoId={videoId} onClose={onClose} />
        )}
      </div>
    </div>
  );
};

export default PlaylistPopUp;
