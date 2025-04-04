import React, { useRef } from "react";

interface VideoSelectionStepProps {
  onVideoSelect: (file: File) => void;
}

const VideoSelectionStep: React.FC<VideoSelectionStepProps> = ({
  onVideoSelect,
}) => {
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onVideoSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100%-80px)] sm:h-[calc(100%-100px)] md:h-[calc(100%-120px)]">
      <div className="flex flex-col items-center justify-center w-full">
        {/* Upload icon in the center */}
        <div className="flex flex-col items-center justify-center mb-8 sm:mb-10 md:mb-12">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-44 md:h-44 bg-blue-100 text-gray-500 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-18 md:h-18"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 10l-4-4m0 0l-4 4m4-4v12"
              />
            </svg>
          </div>
        </div>

        <div className="flex flex-col items-center">
          {/* Video file selection */}
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2.5 sm:py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg font-medium transition-colors"
          >
            Select File
          </button>

          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="mt-4 sm:mt-6 md:mt-8">
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            Your video will be private by default until you publish it.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoSelectionStep;
