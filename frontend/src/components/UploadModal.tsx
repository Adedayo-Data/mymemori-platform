import { Camera, Image as ImageIcon, X } from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCameraUpload: () => void;
  onGalleryUpload: () => void;
}

const UploadModal = ({
  isOpen,
  onClose,
  onCameraUpload,
  onGalleryUpload,
}: UploadModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Upload Photos</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Choose how you'd like to add photos
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-3">
          {/* Camera Option */}
          <button
            onClick={onCameraUpload}
            className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 hover:border-pink-400 hover:bg-pink-50 rounded-xl transition-all group"
          >
            <div className="p-3 bg-pink-100 group-hover:bg-pink-200 rounded-xl transition-colors">
              <Camera className="w-6 h-6 text-pink-600" />
            </div>
            <div className="text-left flex-1">
              <h4 className="font-semibold text-gray-900 text-base">
                Take a Photo
              </h4>
              <p className="text-sm text-gray-500">
                Use your camera to capture a moment
              </p>
            </div>
          </button>

          {/* Gallery Option */}
          <button
            onClick={onGalleryUpload}
            className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl transition-all group"
          >
            <div className="p-3 bg-blue-100 group-hover:bg-blue-200 rounded-xl transition-colors">
              <ImageIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left flex-1">
              <h4 className="font-semibold text-gray-900 text-base">
                Choose from Gallery
              </h4>
              <p className="text-sm text-gray-500">
                Select photos from your device
              </p>
            </div>
          </button>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Maximum file size: 10MB per photo
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
