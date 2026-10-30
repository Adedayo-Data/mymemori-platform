import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { optimizeCloudinaryUrl } from "../utils/cloudinaryOptimizer";

interface Photo {
  photoId: string;
  imageUrl: string;
  uploader: string;
  uploadedAt: string;
  type?: string;
  reactionCount?: number;
}

interface SlideshowModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: Photo[];
  initialIndex?: number;
  eventTitle?: string;
  onLike?: (photoId: string) => void;
}

const SPEED_OPTIONS = [
  { label: "5s", value: 5000 },
  { label: "10s", value: 10000 },
  { label: "15s", value: 15000 },
];

export const SlideshowModal: React.FC<SlideshowModalProps> = ({
  isOpen,
  onClose,
  photos,
  initialIndex = 0,
  eventTitle = "Event Gallery",
  onLike,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [intervalMs, setIntervalMs] = useState(5000);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentSrc, setCurrentSrc] = useState<string>("");

  const currentPhoto = photos[currentIndex];

  const containerRef = useRef<HTMLDivElement>(null);
  const hideControlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTimeRef = useRef<number>(Date.now());

  // Whenever currentPhoto changes, start immediately with cached thumbnail, then upgrade to full-res seamlessly
  useEffect(() => {
    if (!currentPhoto?.imageUrl) {
      setCurrentSrc("");
      return;
    }
    const thumbUrl = optimizeCloudinaryUrl(currentPhoto.imageUrl, { context: "thumbnail" });
    const modalUrl = optimizeCloudinaryUrl(currentPhoto.imageUrl, { context: "modal" });

    // Set immediate thumbnail (from browser cache - 0ms delay)
    setCurrentSrc(thumbUrl);

    // Preload modal full-res in background and upgrade seamlessly without layout shift
    const img = new Image();
    img.src = modalUrl;
    img.onload = () => {
      setCurrentSrc(modalUrl);
    };
  }, [currentPhoto]);

  // Reset index when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex >= 0 && initialIndex < photos.length ? initialIndex : 0);
      setIsPlaying(true);
      setProgress(0);
      lastTimeRef.current = Date.now();
    }
  }, [isOpen, initialIndex, photos.length]);

  // Next photo handler
  const handleNext = useCallback(() => {
    if (photos.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % photos.length);
    setProgress(0);
    lastTimeRef.current = Date.now();
  }, [photos.length]);

  // Previous photo handler
  const handlePrev = useCallback(() => {
    if (photos.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    setProgress(0);
    lastTimeRef.current = Date.now();
  }, [photos.length]);

  // Auto-advance loop with smooth progress tracking (Optimized: 60fps progress bar, minimal re-renders)
  useEffect(() => {
    if (!isOpen || !isPlaying || photos.length <= 1) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    lastTimeRef.current = Date.now();
    const tickInterval = 50; // update progress every 50ms

    progressIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastTimeRef.current;
      const nextProgress = Math.min((elapsed / intervalMs) * 100, 100);

      setProgress(nextProgress);

      if (elapsed >= intervalMs) {
        lastTimeRef.current = now;
        setProgress(0);
        setCurrentIndex((prev) => (prev + 1) % photos.length);
      }
    }, tickInterval);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isOpen, isPlaying, intervalMs, photos.length]);

  // Background Preloader for upcoming images (Pre-caches high-res so slides change with 0 latency)
  useEffect(() => {
    if (!isOpen || photos.length <= 1) return;

    const nextIndices = [
      (currentIndex + 1) % photos.length,
      (currentIndex + 2) % photos.length,
      (currentIndex + 3) % photos.length,
    ];

    nextIndices.forEach((idx) => {
      const photo = photos[idx];
      if (photo?.imageUrl) {
        const img = new Image();
        img.src = optimizeCloudinaryUrl(photo.imageUrl, { context: "modal" });
      }
    });
  }, [currentIndex, isOpen, photos]);

  // Auto-hide controls when mouse is inactive (cinema style)
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    hideControlsTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3200);
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetHideTimer();
    }
    return () => {
      if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    };
  }, [isOpen, resetHideTimer]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      resetHideTimer();

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case " ":
          e.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
        case "ArrowRight":
          handleNext();
          break;
        case "ArrowLeft":
          handlePrev();
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose, resetHideTimer]);

  // Fullscreen toggle API
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  if (!isOpen || photos.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onMouseMove={resetHideTimer}
        onClick={() => resetHideTimer()}
        className="fixed inset-0 z-[150] bg-black text-white select-none overflow-hidden flex flex-col items-center justify-center font-hanken"
        style={{ willChange: "opacity" }}
      >
        {/* Subtle Ambient Background Glow matching the event */}
        <div className="absolute inset-0 bg-[#07070a] pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-[#ff4f93]/10 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-[#c0299b]/10 rounded-full blur-[140px] pointer-events-none" />
        </div>

        {/* Top Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/10 z-30">
          <motion.div
            className="h-full bg-gradient-to-r from-[#ff4f93] via-[#ff75ab] to-[#ddb7ff] shadow-[0_0_12px_rgba(255,79,147,0.8)]"
            style={{ width: `${progress}%`, transition: isPlaying ? "width 50ms linear" : "none" }}
          />
        </div>

        {/* Top Navigation & Info Overlay */}
        <div
          className={`absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between z-30 bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Event & Photo Meta */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden glass-2-0 p-1 flex items-center justify-center bg-white/10 border border-white/15">
              <img alt="Logo" className="w-full h-full object-contain mix-blend-screen" src="/logo.png" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold font-sora text-white line-clamp-1">
                {eventTitle}
              </h2>
              <p className="text-xs text-white/60">
                Photo {currentIndex + 1} of {photos.length}
                {currentPhoto?.uploader && ` • Uploaded by ${currentPhoto.uploader}`}
              </p>
            </div>
          </div>

          {/* Quick Actions (Speed, Fullscreen, Close) */}
          <div className="flex items-center gap-2">
            {/* Speed Selector */}
            <div className="flex items-center bg-white/10 rounded-full p-0.5 border border-white/10 backdrop-blur-md">
              {SPEED_OPTIONS.map((speed) => (
                <button
                  key={speed.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIntervalMs(speed.value);
                    setProgress(0);
                    lastTimeRef.current = Date.now();
                  }}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-full transition-all cursor-pointer ${
                    intervalMs === speed.value
                      ? "bg-[#ff4f93] text-white shadow-sm"
                      : "text-white/60 hover:text-white"
                  }`}
                  title={`Change speed to ${speed.label}`}
                >
                  {speed.label}
                </button>
              ))}
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isFullscreen ? "fullscreen_exit" : "fullscreen"}
              </span>
            </button>

            {/* Close */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer"
              title="Close Slideshow (Esc)"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Main Stage: Perfectly Framed Hardware-Accelerated Image */}
        <div className="relative w-full h-full flex items-center justify-center pt-20 pb-24 px-4 sm:px-20 z-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhoto.photoId}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.015 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full h-full flex items-center justify-center pointer-events-none"
              style={{ willChange: "opacity, transform" }}
            >
              {currentSrc && (
                <img
                  src={currentSrc}
                  alt={currentPhoto.uploader || "Event memory"}
                  className="max-h-full max-w-full object-contain rounded-xl sm:rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.9)] select-none pointer-events-auto"
                  draggable={false}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Left Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className={`absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/40 hover:bg-black/70 border border-white/15 backdrop-blur-md text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer z-30 ${
              showControls ? "opacity-90 hover:opacity-100" : "opacity-0 pointer-events-none"
            }`}
            title="Previous Photo (Left Arrow)"
          >
            <span className="material-symbols-outlined text-2xl">chevron_left</span>
          </button>

          {/* Right Arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className={`absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/40 hover:bg-black/70 border border-white/15 backdrop-blur-md text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer z-30 ${
              showControls ? "opacity-90 hover:opacity-100" : "opacity-0 pointer-events-none"
            }`}
            title="Next Photo (Right Arrow)"
          >
            <span className="material-symbols-outlined text-2xl">chevron_right</span>
          </button>
        </div>

        {/* Bottom Floating Control Bar */}
        <div
          className={`absolute bottom-6 z-30 flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#131318]/85 border border-white/15 backdrop-blur-xl shadow-2xl transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Previous */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all cursor-pointer"
            title="Previous"
          >
            <span className="material-symbols-outlined text-[18px]">skip_previous</span>
          </button>

          {/* Play / Pause Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying((prev) => !prev);
            }}
            className="w-11 h-11 rounded-full bg-gradient-to-r from-[#ff4f93] to-[#c0299b] hover:opacity-95 text-white flex items-center justify-center shadow-[0_0_15px_rgba(255,79,147,0.4)] transition-all active:scale-95 cursor-pointer"
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
          >
            <span className="material-symbols-outlined text-[22px]">
              {isPlaying ? "pause" : "play_arrow"}
            </span>
          </button>

          {/* Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all cursor-pointer"
            title="Next"
          >
            <span className="material-symbols-outlined text-[18px]">skip_next</span>
          </button>

          {/* Optional Like Button if provided */}
          {onLike && currentPhoto?.photoId && (
            <>
              <div className="w-[1px] h-5 bg-white/15 mx-1" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLike(currentPhoto.photoId);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-[#ffb0cd] transition-all cursor-pointer text-xs font-semibold"
                title="Like this photo"
              >
                <span className="material-symbols-outlined text-[18px]">favorite</span>
                <span>{currentPhoto.reactionCount || 0}</span>
              </button>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SlideshowModal;
