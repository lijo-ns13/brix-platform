import { useEffect, useState, useRef } from "react";
import {
  getUserProfile,
  updateProfileImage,
  deleteProfileImage,
} from "../../services/ProfileService";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import BaseModal from "../modals/BaseModal";
import { uploadToCloudinary } from "../../../company/services/cloudinaryService";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Crop, X } from "lucide-react"; // Import icons from your icon library

function ProfileImage() {
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [srcImage, setSrcImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState<boolean>(false);
  const [crop, setCrop] = useState({
    unit: "%",
    width: 100,
    height: 100, // Add height
    x: 0, // Add x
    y: 0, // Add y
    aspect: 1,
  });
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { id } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      fetchUserData(id);
    }
  }, [id]);

  async function fetchUserData(id: string) {
    try {
      const res = await getUserProfile(id);
      setProfilePicture(res.profilePicture);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSrcImage(reader.result as string);
      setIsCropping(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async () => {
    if (!imageRef.current || !crop.width || !crop.height) return;

    const canvas = document.createElement("canvas");
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(
      imageRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    canvas.toBlob(
      async (blob) => {
        if (!blob || !id) return;
        setIsUploading(true);
        try {
          const url = await uploadToCloudinary(blob);
          console.log("url", url);
          await updateProfileImage(id, url);
          setProfilePicture(url);
          setIsCropping(false);
          setSrcImage(null);
          setIsImageModalOpen(false);
        } catch (error) {
          console.error("Image upload failed:", error);
        } finally {
          setIsUploading(false);
        }
      },
      "image/jpeg",
      0.9
    );
  };

  const handleDeleteImage = async () => {
    if (!id) return;
    try {
      await deleteProfileImage(id);
      setProfilePicture("");
      setIsImageModalOpen(false);
    } catch (error) {
      console.error("Failed to delete profile image:", error);
    }
  };

  return (
    <>
      {/* Profile Image with click to open modal */}
      <div className="flex-shrink-0">
        <div className="relative">
          <img
            src={profilePicture || "/api/placeholder/150/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 cursor-pointer hover:border-gray-200 transition"
            onClick={() => setIsImageModalOpen(true)}
          />
          <div
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 rounded-full transition-opacity cursor-pointer"
            onClick={() => setIsImageModalOpen(true)}
          >
            <span className="text-white opacity-0 hover:opacity-100 transition-opacity">
              {profilePicture ? "Update" : "Add"} Image
            </span>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <BaseModal
        isOpen={isImageModalOpen}
        onClose={() => {
          setIsImageModalOpen(false);
          setIsCropping(false);
          setSrcImage(null);
        }}
        title={profilePicture ? "Update Profile Image" : "Add Profile Image"}
      >
        <div className="space-y-4">
          {isCropping && srcImage ? (
            <div className="border rounded-lg p-4">
              <div className="mb-2 flex justify-between items-center">
                <span className="font-medium flex items-center">
                  <Crop className="h-4 w-4 mr-1" /> Crop Image
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsCropping(false);
                    setSrcImage(null);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={1}
                circularCrop
              >
                <img
                  src={srcImage}
                  ref={imageRef}
                  alt="Image to crop"
                  className="max-w-full max-h-64"
                />
              </ReactCrop>

              <div className="flex justify-end mt-2 space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCropping(false);
                    setSrcImage(null);
                  }}
                  className="bg-gray-300 px-3 py-1 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCropComplete}
                  disabled={isUploading}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm disabled:bg-green-300"
                >
                  {isUploading ? "Uploading..." : "Apply Crop"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                <img
                  src={profilePicture || "/api/placeholder/150/150"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                />
              </div>

              <div className="flex flex-col space-y-3">
                <div className="flex justify-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                  >
                    <span>{profilePicture ? "Update Image" : "Add Image"}</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {profilePicture && (
                  <div className="flex justify-center">
                    <button
                      onClick={handleDeleteImage}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                    >
                      <span>Remove Image</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </BaseModal>
    </>
  );
}

export default ProfileImage;
