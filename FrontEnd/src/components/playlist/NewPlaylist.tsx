import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { useState } from "react";
import {
  addVideoToPlaylist,
  createPlaylist,
} from "../../features/playlistSlice";
import toast from "react-hot-toast";

interface NewPlaylistProps {
  videoId?: string;
  onClose: () => void;
}

const NewPlaylist: React.FC<NewPlaylistProps> = ({ videoId, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlayListDescription] = useState("");

  const handleNewPlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const playlist = await dispatch(
        createPlaylist({ playlistName, playlistDescription })
      ).unwrap();
      if (!playlist || !playlist._id) {
        console.error("Playlist creation failed: Invalid response");
        return;
      }
      setPlaylistName("");
      setPlayListDescription("");
      dispatch(
        addVideoToPlaylist({
          playlistId: playlist._id || "",
          videoId: videoId || "",
        })
      )
        .unwrap()
        .then(() => {
          onClose();
          toast.success("Playlist created and video added successfully");
        })
        .catch((error) => {
          toast.error("Failed to add video to playlist: " + error.message);
          console.error("Failed to add video to playlist:", error);
        });
    } catch (error) {
      console.error("Failed to create playlist:", error);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">New Playlist</h2>
      <form onSubmit={handleNewPlaylist} className="space-y-4">
        <input
          type="text"
          placeholder="Playlist Name"
          className="w-full py-4 px-2 border rounded"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={playlistDescription}
          onChange={(e) => setPlayListDescription(e.target.value)}
        ></textarea>
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPlaylist;
