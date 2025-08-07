import { useRef, useState } from "react";

interface VideoMetadataStepProps {
  videoFile: File;
  videoPreviewUrl: string | null;
  onSubmit: (data: {
    title: string;
    description: string;
    thumbnail: File | null;
    tags: string;
    category: string;
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
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
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
    // clear all details
    setThumbnail(null);
    setThumbnailPreviewUrl(null);
    setTitle("");
    setDescription("");
    setTags("");
    setCategory("");
    if (thumbnailPreviewUrl) {
      URL.revokeObjectURL(thumbnailPreviewUrl); // Clean up the object URL
    }
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl); // Clean up the object URL
    }
    onSubmit({ title, description, thumbnail, tags, category, video: videoFile });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-y-auto pr-2 pb-4">
        <form onSubmit={handleSubmit} id="videoMetadataForm" className="h-full">
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
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Video description"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                {/* Tags Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Comma separated tags"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* Category Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Education">Education</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Music">Music</option>
                    <option value="Gaming">Gaming</option>
                    <option value="News">News</option>
                    <option value="Sports">Sports</option>
                    <option value="Technology">Technology</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Travel">Travel</option>
                    <option value="Health">Health</option>
                    <option value="Food">Food</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Vlog">Vlog</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Thumbnail upload*/}
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
                    Select or upload a picture that shows what's in your video.
                    A good thumbnail stands out and draws viewers' attention.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side: Video preview */}
            <div className="md:w-1/3 mt-6 md:mt-0">
              <div className="sticky top-0">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                  <video
                    src={videoPreviewUrl || ""}
                    controls
                    className="object-contain w-full h-full"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  File: {videoFile?.name}
                </p>
                <p className="text-sm text-gray-500">
                  Size: {(videoFile?.size / 1048576).toFixed(2)} MB
                </p>
                <p className="text-sm text-gray-500">
                  Thumbnail:{" "}
                  {thumbnail ? thumbnail.name : "No thumbnail selected"}
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Fixed position buttons at bottom */}
      <div className="border-t border-gray-200 pt-4 mt-2 flex justify-between m-1">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back
        </button>
        <button
          type="submit"
          form="videoMetadataForm"
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
    </div>
  );
};

export default VideoMetadataStep;
