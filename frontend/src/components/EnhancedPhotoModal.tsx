import { Download, Heart, X, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGesture } from "@use-gesture/react";
import { useState, useEffect, useRef } from "react";
import { optimizeCloudinaryUrl } from "../utils/cloudinaryOptimizer";

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
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [progress, setProgress] = useState(0);

  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTimeRef = useRef<number>(Date.now());
  const SLIDESHOW_DURATION = 5000;

  const currentPhoto = photos[currentIndex];


  // Generate optimized URL for modal view (larger size)
  const optimizedModalUrl = currentPhoto.imageUrl
    ? optimizeCloudinaryUrl(currentPhoto.imageUrl, { context: 'modal' })
    : currentPhoto.imageUrl;

  // Background preloader for upcoming images (eliminates stutter during slideshow)
  useEffect(() => {
    if (photos.length <= 1) return;
    const nextIdx1 = (currentIndex + 1) % photos.length;
    const nextIdx2 = (currentIndex + 2) % photos.length;
    [nextIdx1, nextIdx2].forEach((idx) => {
      if (photos[idx]?.imageUrl) {
        const img = new Image();
        img.src = optimizeCloudinaryUrl(photos[idx].imageUrl, { context: "modal" });
      }
    });
  }, [currentIndex, photos]);

  // Slideshow auto-advance loop (Optimized 50ms tick, zero UI freeze)
  useEffect(() => {
    if (!isSlideshow || photos.length <= 1) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    lastTimeRef.current = Date.now();
    const tickInterval = 50;

    progressIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastTimeRef.current;
      const nextProgress = Math.min((elapsed / SLIDESHOW_DURATION) * 100, 100);

      setProgress(nextProgress);

      if (elapsed >= SLIDESHOW_DURATION) {
        lastTimeRef.current = now;
        setProgress(0);
        onNavigate((currentIndex + 1) % photos.length);
      }
    }, tickInterval);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isSlideshow, currentIndex, photos.length, onNavigate]);

  // Reset zoom & timer when photo changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setProgress(0);
    lastTimeRef.current = Date.now();
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
        case "p":
        case "P":
        case "s":
        case "S":
          setIsSlideshow((prev) => !prev);
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
        // Pause slideshow on manual gesture interaction
        if (isSlideshow) setIsSlideshow(false);

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
        if (isSlideshow) setIsSlideshow(false);
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
    if (isSlideshow) setIsSlideshow(false);
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
        className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center select-none"
        onClick={onClose}
      >
        {/* Slideshow Progress Bar */}
        {isSlideshow && (
          <div className="absolute top-0 inset-x-0 h-1 bg-white/10 z-50">
            <div
              className="h-full bg-gradient-to-r from-[#ff4f93] via-[#ff75ab] to-[#ddb7ff] shadow-[0_0_10px_rgba(255,79,147,0.8)]"
              style={{ width: `${progress}%`, transition: "width 50ms linear" }}
            />
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          title="Close (Esc)"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Photo Counter & Slideshow Toggle */}
        <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
          <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full">
            <p className="text-white text-sm font-medium">
              {currentIndex + 1} / {photos.length}
            </p>
          </div>

          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsSlideshow((prev) => !prev);
              }}
              className={`px-3 py-2 rounded-full flex items-center gap-1.5 backdrop-blur-md transition-all text-xs font-semibold cursor-pointer ${
                isSlideshow
                  ? "bg-[#ff4f93] text-white shadow-[0_0_12px_rgba(255,79,147,0.5)]"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
              title={isSlideshow ? "Pause Slideshow (P)" : "Play Slideshow (P)"}
            >
              {isSlideshow ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              <span className="hidden sm:inline">
                {isSlideshow ? "Pause" : "Slideshow"}
              </span>
            </button>
          )}
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
                src={optimizedModalUrl}
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
                  className={`w-5 h-5 ${isLiked ? "fill-pink-500 text-pink-500" : "text-white"
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
