import { Download, Heart, Share2, X } from "lucide-react";

interface PhotoModalProps {
  photoId: number;
  isLiked: boolean;
  onClose: () => void;
  onLike: (photoId: number) => void;
  onShare: (photoId: number) => void;
  onDownload: (photoId: number) => void;
}

const PhotoModal = ({
  photoId,
  isLiked,
  onClose,
  onLike,
  onShare,
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
        <div className="relative h-96 bg-linear-to-br from-pink-100 to-rose-100 flex items-center justify-center">
          <span className="text-6xl font-bold text-white/20">{photoId}</span>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Photo Info */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Photo #{photoId}
              </h3>
              <p className="text-sm text-gray-600">
                Uploaded by Sarah • 2 hours ago
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onLike(photoId)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Heart
                  className={`w-6 h-6 ${
                    isLiked
                      ? "fill-pink-600 text-pink-600"
                      : "text-gray-400"
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-gray-600">
                {isLiked ? "1" : "0"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => onShare(photoId)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={() => onDownload(photoId)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
