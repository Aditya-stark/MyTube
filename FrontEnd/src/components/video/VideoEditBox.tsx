import { useRef, useState, useEffect } from "react";
import { HiArrowNarrowRight } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { updateVideo } from "../../features/videos/videoSlice";

interface VideoEditBoxPopupProps {
  isOpen: boolean;
  onClose: () => void;
  editVideoData?: any;
}

const VideoEditBox: React.FC<VideoEditBoxPopupProps> = ({
  isOpen,
  onClose,
  editVideoData,

}) => {
  const initialTitle = editVideoData?.title || "";
  const initialDescription = editVideoData?.description || "";
  const initialPublishStatus = editVideoData?.isPublished || false;
  const thumbnailURL = editVideoData?.thumbnail || "";
  const videoURL = editVideoData?.videoFile;
  const localVideoData = editVideoData?.localVideoData || null;

  // Prevent background scrolling when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  const videoId = editVideoData?._id || "";
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(
    thumbnailURL
  );
  const [publishStatus, setPublishStatus] = useState<boolean | null>(
    initialPublishStatus
  );
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  // Handle thumbnail selection
  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
      setThumbnailPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Remove thumbnail (unload)
  const handleRemoveThumbnail = () => {
    if (thumbnailPreviewUrl && thumbnail) {
      URL.revokeObjectURL(thumbnailPreviewUrl);
    }
    setThumbnail(null);
    setThumbnailPreviewUrl("");
  };

  // Handle update submit
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("isPublished", publishStatus ? "true" : "false");

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    await dispatch(updateVideo({ videoId, videoData: formData }));
    
    // Clear all fields after submission
    setTitle("");
    setDescription("");
    setThumbnail(null);
    setThumbnailPreviewUrl("");
    setPublishStatus(false);
    if (thumbnailPreviewUrl) {
      URL.revokeObjectURL(thumbnailPreviewUrl); // Clean up the object URL
    }
    if (videoURL) {
      URL.revokeObjectURL(videoURL); // Clean up the object URL
    }
    onClose();
  };

  useEffect(() => {
    setTitle(editVideoData?.title || "");
    setDescription(editVideoData?.description || "");
    setThumbnail(null);
    setThumbnailPreviewUrl(editVideoData?.thumbnail || "");
    setPublishStatus(editVideoData?.isPublished || false);
  }, [editVideoData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-4xl min-h-[400px] sm:min-h-[500px] md:min-h-[600px] h-[80vh] p-4 sm:p-6 md:p-8 relative flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 z-10"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-left text-gray-800 mb-4 sm:mb-6">
          Edit Video
        </h2>
        {/* Scrollable content area */}
        <div className="flex-1 min-h-0 h-[calc(100%-8%)] sm:h-[calc(100%-10%)] md:h-[calc(100%-10%)] overflow-y-auto pr-2 pb-4">
          <form
            onSubmit={handleUpdate}
            id="videoEditForm"
            className="h-full flex flex-col"
          >
            <div className="flex flex-col md:flex-row h-full">
              {/* Left side: Metadata form */}
              <div className="md:w-2/3 pr-0 md:pr-6">
                <div className="space-y-6">
                  {/* Title Input */}
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Video title"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  {/* Description Input */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={6}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Video description"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  {/* Thumbnail upload*/}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thumbnail
                    </label>
                    <div className="mt-1 flex items-start gap-2">
                      {thumbnailPreviewUrl ? (
                        <div className="relative group">
                          <div className="relative w-52 pb-[56.25%]">
                            <img
                              src={thumbnailPreviewUrl}
                              alt="Thumbnail preview"
                              className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveThumbnail}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => thumbnailInputRef.current?.click()}
                          className="flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <svg
                            className="w-5 h-5 mr-2 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12"
                            />
                          </svg>
                          Upload thumbnail
                        </button>
                      )}
                      <input
                        ref={thumbnailInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleThumbnailSelect}
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Select or upload a picture that shows what's in your
                      video. A good thumbnail stands out and draws viewers'
                      attention.
                    </p>
                  </div>

                  {/* Publish status dropdown */}
                  <div className="flex flex-col mt-4">
                    <label
                      htmlFor="publishStatus"
                      className="mb-1 text-sm font-medium text-gray-700"
                    >
                      Publish Status:
                    </label>
                    <select
                      id="publishStatus"
                      name="publishStatus"
                      value={
                        publishStatus !== null ? String(publishStatus) : "false"
                      }
                      onChange={(e) =>
                        setPublishStatus(
                          e.target.value === "true" ? true : false
                        )
                      }
                      className="mt-1 block w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="true">Public</option>
                      <option value="false">Private</option>
                    </select>
                    <div className="mb-10" />
                  </div>
                </div>
              </div>

              {/* Right side: Video preview (optional) */}
              {videoURL && (
                <div className="md:w-1/3 mt-6 md:mt-0">
                  <div className="sticky top-0">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                      <video
                        src={videoURL || ""}
                        controls
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      File: {localVideoData?.original_file_name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Size: {(localVideoData?.bytes / 1048576).toFixed(2)} MB
                    </p>
                    <p className="text-sm text-gray-500">
                      Thumbnail:{" "}
                      {thumbnail ? thumbnail.name : "Current thumbnail"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
        {/* Fixed position buttons at bottom */}
        <div className="border-t border-gray-200 pt-4 mt-2 flex justify-between m-1 bg-white sticky bottom-0 left-0 right-0 z-20">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back
          </button>
          <button
            type="submit"
            form="videoEditForm"
            disabled={!title.trim()}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              !title.trim()
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            Update
            <span className="ml-2">
              {/* Using react-icons/hi for an arrow icon */}
              <HiArrowNarrowRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoEditBox;
