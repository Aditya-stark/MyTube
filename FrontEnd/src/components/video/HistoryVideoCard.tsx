import { useNavigate } from "react-router";
import { MdOutlineHistory } from "react-icons/md";

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
  };
}

const HistoryVideoCard: React.FC<HistoryVideoCardProps> = ({ video }) => {
  const navigate = useNavigate();

  const handleVideoClick = () => {
    navigate(`/watch/${video._id}`);
  };

  return (
    <div
      className="bg-white shadow-lg rounded-lg overflow-hidden hover:cursor-pointer group flex flex-col w-full min-w-0 max-w-full"
      onClick={handleVideoClick}
    >
      <div className="relative">
        <img
          src={video.thumbnail || "/default-video-thumb.jpg"}
          alt="Video Thumbnail"
          className="w-full h-40 object-cover group-hover:brightness-50"
        />
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <MdOutlineHistory className="inline text-lg" />
          {video.views} {video.views === 1 ? "view" : "views"}
        </div>
      </div>
      <div className="flex-1 flex flex-col p-2">
        <h3
          className="text-sm sm:text-base font-semibold mb-1"
          title={video.title}
        >
          {video.title}
        </h3>
        <span className="text-xs text-gray-600 mb-1">
          {video.owner.fullName} ({video.owner.username})
        </span>
        <p className="text-xs text-gray-500 line-clamp-2">
          {video.description}
        </p>
      </div>
    </div>
  );
};

export default HistoryVideoCard;
