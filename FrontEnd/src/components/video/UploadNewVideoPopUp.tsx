import { useEffect, useState } from "react";
import VideoSelectionStep from "./VideoSelectionStep";
import VideoMetadataStep from "./VideoMetadataStep";

interface UploadNewVideoPopUpProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadNewVideoPopUp: React.FC<UploadNewVideoPopUpProps> = ({
  isOpen,
  onClose,
}) => {
  // const dispatch = useDispatch<AppDispatch>();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

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

  //HANDLE FILE SELECTION
  const handleVideoSelect = (file: File) => {
    setVideoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(previewUrl);
  };

  // HANDLE FINAL SUBMISSION WITH METADATA
  const handleSubmitVideo = async (data: {
    title: string;
    description: string;
    thumbnail: File | null;
    video: File | null;
  }) => {
    console.log("Submitting video with metadata:", data);
    

    //Cleanup
    onClose();
  };

  // HANDLE BACK TO VIDEO SELECTION
  const handleBack = () => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl); // Clean up the object URL
    }
    setVideoFile(null);
    setVideoPreviewUrl(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-4xl 
                    min-h-[400px] sm:min-h-[500px] md:min-h-[600px] 
                    h-[80vh] 
                    p-4 sm:p-6 md:p-8 relative">
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

        {/* Title with responsive text size */}
        <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-left text-gray-800 mb-4 sm:mb-6">
          Upload Video
        </h2>

        {/* Content with fixed height container */}
        <div className="h-[calc(100%-8%)] sm:h-[calc(100%-10%)] md:h-[calc(100%-10%)] overflow-hidden">
          {!videoFile ? (
            <VideoSelectionStep onVideoSelect={handleVideoSelect} />
          ) : (
            <VideoMetadataStep
              videoFile={videoFile}
              videoPreviewUrl={videoPreviewUrl}
              onSubmit={handleSubmitVideo}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadNewVideoPopUp;
