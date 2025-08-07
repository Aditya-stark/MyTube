import { useNavigate } from "react-router";

interface HistoryVideoCardProps {
  video: {
    _id: string;
    title: string;
    thumbnail: string;
    owner: {
      username: string;
      fullName: string;
    };
    views: number;
    description: string;
    duration: number;
  };
}

const HistoryVideoCard: React.FC<HistoryVideoCardProps> = ({ video }) => {
  const navigate = useNavigate();

  function formatViews(views: number): string {
    if (views < 1000) return views.toString();
    if (views < 1_000_000) return `${(views / 1000).toFixed(1)}K`;
    if (views < 1_000_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
    return `${(views / 1_000_000_000).toFixed(1)}B`;
  }

  function formatDuration(duration: number): string {
    const min = Math.floor(duration / 60)
      .toString()
      .padStart(2, "0");
    const sec = Math.floor(duration % 60)
      .toString()
      .padStart(2, "0");
    return `${min}:${sec}`;
  }

  const handleVideoClick = () => {
    navigate(`/watch?vId=${video._id}`);
  };

  return (
    <div
      className="flex md:w-[80%] w-full items-start bg-white shadow-sm rounded-lg hover:bg-gray-100 transition mb-4 cursor-pointer min-h-[120px] max-h-[170px]"
      onClick={handleVideoClick}
    >
      {/* Thumbnail */}
      <div className="relative w-[240px] aspect-[16/9] rounded-md overflow-hidden flex-shrink-0">
        <img
          src={video.thumbnail || "/default-video-thumb.jpg"}
          alt="Video Thumbnail"
          className="w-full h-full object-cover"
        />
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-sm px-2 py-0.5 rounded">
          {formatDuration(video.duration)}
        </span>
      </div>
      {/* Details */}
      <div className="flex flex-col justify-center flex-1 pl-4 pr-3 py-2">
        <h3
          className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2"
          title={video.title}
        >
          {video.title}
        </h3>
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <span className="font-medium">{video.owner.fullName}</span>
          <span className="mx-1">•</span>
          <span>{formatViews(video.views)} views</span>
        </div>
        <p className="text-xs text-gray-500 mb-0.5 line-clamp-2">
          {video.description}
        </p>
      </div>
    </div>
  );
};

export default HistoryVideoCard;
