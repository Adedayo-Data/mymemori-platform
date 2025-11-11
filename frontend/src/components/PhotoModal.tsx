import { Download, Heart, X } from "lucide-react";

interface Photo {
  id: number;
  type: string;
  size: string;
  color: string;
  uploader: string;
  uploadedAt: string;
  imageUrl?: string;
}

interface PhotoModalProps {
  photo: Photo;
  isLiked: boolean;
  onClose: () => void;
  onLike: (photoId: number) => void;
  onDownload: (photoId: number) => void;
}

const PhotoModal = ({
  photo,
  isLiked,
  onClose,
  onLike,
  onDownload,
}: PhotoModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photo Display */}
        <div className="relative h-96 bg-gray-100 flex items-center justify-center">
          {photo.imageUrl ? (
            <img
              src={photo.imageUrl}
              alt={`Photo by ${photo.uploader}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="bg-linear-to-br from-pink-100 to-rose-100 w-full h-full flex items-center justify-center">
              <span className="text-6xl font-bold text-white/20">
                {photo.id}
              </span>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Photo Info */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">
                Uploaded by {photo.uploader} • {photo.uploadedAt}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDownload(photo.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => onLike(photo.id)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Heart
                  className={`w-6 h-6 ${
                    isLiked ? "fill-pink-600 text-pink-600" : "text-gray-400"
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-gray-600">
                {isLiked ? "1" : "0"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
