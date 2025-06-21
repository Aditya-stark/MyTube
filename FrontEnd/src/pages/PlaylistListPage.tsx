import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router";
import { AppDispatch } from "../store/store";
import { useEffect } from "react";
import { getPlaylistById } from "../features/playlistSlice";

const PlaylistListPage = () => {
  const [searchParams] = useSearchParams();
  const playlistId = searchParams.get("list");
  console.log("Playlist ID:", playlistId);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!playlistId) {
      console.error("No playlist ID provided in search params");
      return;
    }
    dispatch(getPlaylistById(playlistId));
  }, [playlistId, dispatch]);

  return <h1>Playlist List Page</h1>;
};

export default PlaylistListPage;
