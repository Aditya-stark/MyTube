import { useRef, useState } from "react";

interface VideoMetadataStepProps {
  videoFile: File;
  videoPreviewUrl: string | null;
  onSubmit: (data: {
    title: string;
    description: string;
    thumbnail: File | null;
    video: File | null;
  }) => void;
  onBack: () => void;
}

const VideoMetadataStep: React.FC<VideoMetadataStepProps> = ({
  videoFile,
  videoPreviewUrl,
  onSubmit,
  onBack,
}) => {
  let [title, setTitle] = useState(videoFile.name.split(".")[0]);
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(
    null
  );
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  //HANDLE THUMBNAIL SUBMISSION
  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
      setThumbnailPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  // HANDLE FINAL SUBMISSION WITH METADATA
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ title, description, thumbnail, video: videoFile });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="h-[calc(100%-80px)] overflow-hidden"
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Left side: Metadata form (2/3 width on medium screens and above) */}
        <div className="md:w-2/3 pr-0 md:pr-6 overflow-y-auto pb-4">
          <div className="space-y-6">
            {/* Title input */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title (required)
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description input */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell viewers about your video"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
            </div>

            {/* Thumbnail upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail
              </label>
              <div className="mt-1 flex items-start">
                {thumbnailPreviewUrl ? (
                  <div className="relative group">
                    <div className="relative w-48 pb-[56.25%]">
                      {/* 56.25% = 9/16 ratio */}
                      <img
                        src={thumbnailPreviewUrl}
                        alt="Thumbnail preview"
                        className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (thumbnailPreviewUrl) {
                          URL.revokeObjectURL(thumbnailPreviewUrl);
                        }
                        setThumbnail(null);
                        setThumbnailPreviewUrl(null);
                      }}
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
                Select or upload a picture that shows what's in your video. A
                good thumbnail stands out and draws viewers' attention.
              </p>
            </div>
          </div>
        </div>

        {/* Right side: Video preview (1/3 width on medium screens and above) */}
        <div className="md:w-1/3 mt-6 md:mt-0">
          <div className="sticky top-0">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Video Preview
            </h3>
            {videoPreviewUrl && (
              <div className="rounded-lg overflow-hidden bg-gray-100 shadow">
                <video
                  src={videoPreviewUrl}
                  controls
                  className="w-full h-auto"
                  preload="metadata"
                ></video>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-700 mb-1 truncate">
                    {videoFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <p className="text-xs text-gray-500">{videoFile.type}</p>
                  <p className="text-xs text-gray-500">
                    Thumbnail: {thumbnail?.name || "not selected"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons - fixed at the bottom */}
      <div className="flex justify-between pt-4 border-t border-gray-200 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
        <button
          type="submit"
          disabled={!title.trim() || !thumbnail}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            !title.trim() || !thumbnail
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700"
          }`}
        >
          Upload
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default VideoMetadataStep;
