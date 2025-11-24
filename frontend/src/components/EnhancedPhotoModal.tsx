import { Download, Heart, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGesture } from "@use-gesture/react";
import { useState, useEffect } from "react";

interface Photo {
  photoId: string;  // Changed from id: number
  type: string;
  size: string;
  color: string;
  uploader: string;
  uploadedAt: string;
  imageUrl?: string;
}

interface EnhancedPhotoModalProps {
  photos: Photo[];
  currentIndex: number;
  isLiked: boolean;
  onClose: () => void;
  onLike: (photoId: string) => void;
  onDownload: (photoId: string) => void;
  onNavigate: (index: number) => void;
}

const EnhancedPhotoModal = ({
  photos,
  currentIndex,
  isLiked,
  onClose,
  onLike,
  onDownload,
  onNavigate,
}: EnhancedPhotoModalProps) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const currentPhoto = photos[currentIndex];

  // Reset zoom when photo changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (currentIndex > 0) {
            onNavigate(currentIndex - 1);
          }
          break;
        case "ArrowRight":
          if (currentIndex < photos.length - 1) {
            onNavigate(currentIndex + 1);
          }
          break;
        case " ":
          e.preventDefault();
          onLike(currentPhoto.photoId);
          break;
        case "d":
        case "D":
          onDownload(currentPhoto.photoId);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, photos.length, currentPhoto.photoId, onClose, onNavigate, onLike, onDownload]);

  // Gesture handling for swipe and pinch
  const bind = useGesture(
    {
      onDrag: ({ offset: [x, y], direction: [xDir], cancel, canceled }) => {
        // If zoomed in, allow panning
        if (scale > 1) {
          setPosition({ x, y });
        } else {
          // Swipe to navigate or close
          if (Math.abs(y) > 100 && !canceled) {
            // Swipe down to close
            cancel();
            onClose();
          } else if (Math.abs(x) > 100 && !canceled) {
            // Swipe left/right to navigate
            cancel();
            if (xDir > 0 && currentIndex > 0) {
              onNavigate(currentIndex - 1);
            } else if (xDir < 0 && currentIndex < photos.length - 1) {
              onNavigate(currentIndex + 1);
            }
          }
        }
      },
      onPinch: ({ offset: [d] }) => {
        const newScale = Math.max(1, Math.min(3, 1 + d / 200));
        setScale(newScale);
        if (newScale === 1) {
          setPosition({ x: 0, y: 0 });
        }
      },
    },
    {
      drag: {
        from: () => [position.x, position.y],
      },
      pinch: {
        scaleBounds: { min: 1, max: 3 },
        rubberband: true,
      },
    }
  );

  const handleDoubleClick = () => {
    if (scale === 1) {
      setScale(2);
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Photo Counter */}
        <div className="absolute top-4 left-4 z-50 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full">
          <p className="text-white text-sm font-medium">
            {currentIndex + 1} / {photos.length}
          </p>
        </div>

        {/* Navigation Arrows */}
        {currentIndex > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(currentIndex - 1);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        )}

        {currentIndex < photos.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(currentIndex + 1);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all hover:scale-110"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        )}

        {/* Photo Container */}
        <div
          className="relative w-full h-full flex items-center justify-center p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            {...bind()}
            style={{
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              touchAction: "none",
            }}
            className="relative max-w-5xl max-h-[85vh] cursor-grab active:cursor-grabbing transition-transform"
            onDoubleClick={handleDoubleClick}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentPhoto.photoId}
                src={currentPhoto.imageUrl}
                alt={`Photo by ${currentPhoto.uploader}`}
                className="w-full h-150 object-contain rounded-lg select-none pb-20"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                draggable={false}
              />
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Info Bar */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-w-5xl mx-auto">
            {/* Photo Info */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white text-base font-semibold mb-1">
                  {currentPhoto.uploader}
                </p>
                <p className="text-white/70 text-sm">
                  {currentPhoto.uploadedAt}
                </p>
              </div>

              {/* Zoom Indicator */}
              {scale > 1 && (
                <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full">
                  <p className="text-white text-xs font-medium">
                    {Math.round(scale * 100)}%
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onLike(currentPhoto.photoId)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isLiked ? "fill-pink-500 text-pink-500" : "text-white"
                  }`}
                />
                <span className="text-white text-sm font-medium">
                  {isLiked ? "Liked" : "Like"}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDownload(currentPhoto.photoId)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl transition-colors"
              >
                <Download className="w-5 h-5 text-white" />
                <span className="text-white text-sm font-medium">Download</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EnhancedPhotoModal;
