import React from "react";
import { useSearchParams } from "react-router-dom";

export const WatchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("vId");

  return (
    <div>
      <h1>Youtube Watch Page</h1>
      {videoId ? <p>Video ID: {videoId}</p> : <p>No video selected.</p>}
    </div>
  );
};
