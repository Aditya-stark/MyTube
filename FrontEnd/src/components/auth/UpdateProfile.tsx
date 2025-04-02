import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import {
  updateUserAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../../features/auth/authSlice";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const UpdateProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");

  // File input Refrenses
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  // File State for preview which stores the image URL
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );
  // Actual file
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  // Initialize form with user data whenever it changes
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setFullName(user.fullName || "");

      // Reset previews when user changes
      setAvatarPreview(null);
      setCoverImagePreview(null);
    }
  }, [user]);

  // Handle file input change for avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setCoverImagePreview(previewUrl);
    }
  };

  // Handle file input click for avatar
  const handleAvatarClick = () => {
    if (avatarInputRef.current) {
      avatarInputRef.current.click();
    }
  };

  // Handle file input click for cover image
  const handleCoverImageClick = () => {
    if (coverImageInputRef.current) {
      coverImageInputRef.current.click();
    }
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (avatarFile) {
      await dispatch(updateUserAvatar(avatarFile));
    }
    if (coverImageFile) {
      await dispatch(updateUserCoverImage(coverImageFile));
    }

    // Basic validation
    if (!username.trim() || !email.trim() || !fullName.trim()) {
      return;
    }

    try {
      // Dispatch update action
      const res = await dispatch(
        updateUserAccountDetails({
          username,
          email,
          fullName,
        })
      );

      console.log("res", res);

      if (res.payload.success) {
        toast.success(res.payload.message);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        // Extract actual error message from backend
        const errorMessage = res.payload.message || "Failed to update profile";
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden my-8 px-4 sm:px-0">
      {/* Cover Image Section */}
      <div
        className="h-64 w-full bg-gray-200 relative cursor-pointer"
        onClick={handleCoverImageClick}
      >
        <img
          src={coverImagePreview || user?.coverImage || "/default-cover.jpg"}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-50 flex items-center justify-center transition-opacity">
          <span className="text-white text-lg font-medium">
            Change Cover Image
          </span>
        </div>
        <input
          type="file"
          ref={coverImageInputRef}
          onChange={handleCoverImageChange}
          className="hidden"
          accept="image/*"
        />
      </div>

      {/* Avatar Section */}
      <div className="flex justify-center -mt-20 relative z-10">
        <div
          className="h-40 w-40 rounded-full border-4 border-white bg-gray-200 overflow-hidden cursor-pointer relative"
          onClick={handleAvatarClick}
        >
          <img
            src={avatarPreview || user?.avatar || "/default-avatar.jpg"}
            alt="Avatar"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-50 flex items-center justify-center transition-opacity rounded-full">
            <span className="text-white text-sm font-medium">
              Change Avatar
            </span>
          </div>
          <input
            type="file"
            ref={avatarInputRef}
            onChange={handleAvatarChange}
            className="hidden"
            accept="image/*"
          />
        </div>
      </div>

      {/* Profile Details Form */}
      <div className="p-8 pt-4">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Update Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="fullName"
            >
              Full Name
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Save Changes"}
            </button>

            <button
              type="button"
              className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              onClick={() => navigate("/")}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
