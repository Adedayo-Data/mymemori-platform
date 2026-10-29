import { useState } from "react";
import Masonry from "react-masonry-css";
import { motion, AnimatePresence } from "framer-motion";
import { useDoubleTap } from "../hooks/useDoubleTap";
import { optimizeCloudinaryUrl, getBlurPlaceholder } from "../utils/cloudinaryOptimizer";
import "../styles/masonry.css";

export interface Photo {
  photoId: string;
  type: string;
  size: string;
  color: string;
  uploader: string;
  uploadedAt: string;
  imageUrl?: string;
  reactionCount?: number;
  canDelete?: boolean;
}

interface PhotoGridProps {
  photos: Photo[];
  viewMode: "grid" | "list";
  likedPhotos: Set<string>;
  onPhotoClick: (photoId: string) => void;
  onLike: (photoId: string) => void;
  onDownload: (photoId: string) => void;
  onDelete?: (photoId: string) => void;
  isAuthenticated?: boolean;
  isDownloadLocked?: boolean;
}

const PhotoGrid = ({
  photos,
  viewMode,
  likedPhotos,
  onPhotoClick,
  onLike,
  onDownload,
  onDelete,
  isAuthenticated = true,
  isDownloadLocked = false,
}: PhotoGridProps) => {
  const [showHeartAnimation, setShowHeartAnimation] = useState<string | null>(null);

  // Masonry breakpoints
  const breakpointColumns = {
    default: 5,
    1280: 4,
    900: 3,
    640: 2,
  };

  // Handle double-tap to like with animation
  const handleDoubleTapLike = (photoId: string) => {
    onLike(photoId);
    setShowHeartAnimation(photoId);

    // Haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    setTimeout(() => setShowHeartAnimation(null), 1000);
  };

  if (viewMode === "grid") {
    return (
      <Masonry
        breakpointCols={breakpointColumns}
        className="masonry-grid"
        columnClassName="masonry-grid-column"
      >
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.photoId}
            photo={photo}
            index={index}
            isLiked={likedPhotos.has(photo.photoId)}
            showHeartAnimation={showHeartAnimation === photo.photoId}
            onPhotoClick={onPhotoClick}
            onLike={onLike}
            onDoubleTapLike={handleDoubleTapLike}
            onDownload={onDownload}
            onDelete={onDelete}
            isAuthenticated={isAuthenticated}
            isDownloadLocked={isDownloadLocked}
          />
        ))}
      </Masonry>
    );
  }

  // List view with dark styling
  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {photos.map((photo) => {
        const isLiked = likedPhotos.has(photo.photoId);
        return (
          <div
            key={photo.photoId}
            className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 hover:bg-white/10 backdrop-blur-md transition-all cursor-pointer flex items-center justify-between gap-4"
            onClick={() => onPhotoClick(photo.photoId)}
          >
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              {photo.imageUrl ? (
                <img
                  src={photo.imageUrl}
                  alt={`Photo by ${photo.uploader}`}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                />
              ) : (
                <div
                  className={`w-16 h-16 rounded-xl bg-linear-to-br ${photo.color} shrink-0`}
                />
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#e4e1e9] truncate">
                  {photo.uploader}
                </p>
                <p className="text-xs text-[#debec8]/70">{photo.uploadedAt}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onLike(photo.photoId);
                }}
                className={`action-icon relative w-10 h-10 rounded-full bg-[#1e1d24]/90 hover:bg-[#2c2b36] border border-white/15 backdrop-blur-md flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer ${
                  isLiked ? "text-[#ffb0cd]" : "text-white"
                }`}
                title="Like"
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0",
                    fontSize: "20px",
                  }}
                >
                  favorite
                </span>
                {photo.reactionCount !== undefined && photo.reactionCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 bg-[#ffb0cd] text-[#40000d] rounded-full text-[9px] font-bold flex items-center justify-center">
                    {photo.reactionCount > 99 ? "99+" : photo.reactionCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(photo.photoId);
                }}
                className="action-icon relative w-10 h-10 rounded-full bg-[#1e1d24]/90 hover:bg-[#2c2b36] border border-white/15 backdrop-blur-md flex items-center justify-center text-white shadow-md active:scale-90 transition-all cursor-pointer"
                title={isDownloadLocked ? "Sign up to download (Free limit reached)" : "Download"}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                  download
                </span>
                {isDownloadLocked && (
                  <div className="absolute -top-1 -right-1 bg-[#f751a1] rounded-full p-0.5">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>

              {onDelete && (photo.canDelete === undefined || photo.canDelete) && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(photo.photoId);
                  }}
                  className="action-icon w-10 h-10 rounded-full bg-[#1e1d24]/90 hover:bg-red-500/25 border border-white/15 backdrop-blur-md flex items-center justify-center text-white hover:text-[#ffb4ab] hover:border-red-500/30 shadow-md active:scale-90 transition-all cursor-pointer"
                  title="Delete photo"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                    delete
                  </span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Individual Photo Card Component
interface PhotoCardProps {
  photo: Photo;
  index: number;
  isLiked: boolean;
  showHeartAnimation: boolean;
  onPhotoClick: (photoId: string) => void;
  onLike: (photoId: string) => void;
  onDoubleTapLike: (photoId: string) => void;
  onDownload: (photoId: string) => void;
  onDelete?: (photoId: string) => void;
  isAuthenticated?: boolean;
  isDownloadLocked?: boolean;
}

const PhotoCard = ({
  photo,
  index,
  isLiked,
  showHeartAnimation,
  onPhotoClick,
  onLike,
  onDoubleTapLike,
  onDownload,
  onDelete,
  isDownloadLocked = false,
}: PhotoCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [blurLoaded, setBlurLoaded] = useState(false);

  const handleTap = useDoubleTap({
    onDoubleTap: () => onDoubleTapLike(photo.photoId),
    onSingleTap: () => onPhotoClick(photo.photoId),
    delay: 300,
  });

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload(photo.photoId);
  };

  // Generate optimized URLs
  const optimizedUrl = photo.imageUrl ? optimizeCloudinaryUrl(photo.imageUrl, { context: 'thumbnail' }) : '';
  const blurUrl = photo.imageUrl ? getBlurPlaceholder(photo.imageUrl) : '';

  // Check if live / recent
  const isRecent = photo.uploadedAt?.toLowerCase().includes("just now") || 
                   photo.uploadedAt?.toLowerCase().includes("m ago") || 
                   photo.uploadedAt?.toLowerCase().includes("sec");

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.03, 0.3),
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="masonry-item premium-border-glow card-hover-group group relative rounded-xl overflow-hidden cursor-pointer mb-4 select-none bg-white/5 border border-white/10"
      style={{
        background: !imageLoaded ? `linear-gradient(135deg, ${photo.color || '#1f1f25'})` : undefined,
      }}
      onClick={handleTap}
    >
      {/* Photo Image */}
      {photo.imageUrl ? (
        <>
          {/* Blur placeholder */}
          {blurUrl && (
            <img
              src={blurUrl}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                blurLoaded && !imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setBlurLoaded(true)}
              aria-hidden="true"
            />
          )}

          {/* Full quality image - optimized */}
          <img
            src={optimizedUrl}
            alt={`Photo by ${photo.uploader}`}
            className={`w-full h-auto object-cover rounded-xl block transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        </>
      ) : (
        <div className="w-full h-64 flex items-center justify-center bg-white/5">
          <span className="material-symbols-outlined text-4xl text-white/30">image</span>
        </div>
      )}

      {/* Live Badge for recent photos */}
      {isRecent && (
        <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2 py-0.5 flex items-center gap-1.5 shadow-lg z-10 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-[#ffb0cd] relative live-dot" />
          <span className="font-label-md text-white text-[10px] tracking-wider uppercase font-semibold">
            Live
          </span>
        </div>
      )}

      {/* Double-tap heart animation */}
      <AnimatePresence>
        {showHeartAnimation && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          >
            <span
              className="material-symbols-outlined text-white drop-shadow-2xl"
              style={{ fontSize: "72px", fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons at bottom - Centered Circular Row */}
      <div className="overlay-actions absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex justify-center items-center gap-3 sm:gap-4 z-20">
        {/* Like button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onLike(photo.photoId);
          }}
          className={`action-icon relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1e1d24]/90 hover:bg-[#2c2b36] border border-white/15 backdrop-blur-md flex items-center justify-center shadow-lg active:scale-90 transition-all cursor-pointer ${
            isLiked ? "text-[#ffb0cd]" : "text-white hover:text-[#ffb0cd]"
          }`}
          title="Like"
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0",
              fontSize: "22px",
            }}
          >
            favorite
          </span>
          {photo.reactionCount !== undefined && photo.reactionCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#ffb0cd] text-[#40000d] rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm">
              {photo.reactionCount > 99 ? "99+" : photo.reactionCount}
            </span>
          )}
        </button>

        {/* Download button */}
        <button
          type="button"
          onClick={handleDownloadClick}
          className="action-icon relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1e1d24]/90 hover:bg-[#2c2b36] border border-white/15 backdrop-blur-md flex items-center justify-center text-white hover:text-primary shadow-lg active:scale-90 transition-all cursor-pointer"
          title={isDownloadLocked ? "Sign up to download (Free limit reached)" : "Download"}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>
            download
          </span>
          {isDownloadLocked && (
            <div className="absolute -top-1 -right-1 bg-[#f751a1] rounded-full p-0.5 shadow-sm">
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </button>

        {/* Delete button (if user is allowed) */}
        {onDelete && (photo.canDelete === undefined || photo.canDelete) && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(photo.photoId);
            }}
            className="action-icon w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1e1d24]/90 hover:bg-red-500/25 border border-white/15 backdrop-blur-md flex items-center justify-center text-white hover:text-[#ffb4ab] hover:border-red-500/30 shadow-lg active:scale-90 transition-all cursor-pointer"
            title="Delete photo"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>
              delete
            </span>
          </button>
        )}
      </div>

      {/* Desktop hover metadata */}
      <div className="hidden md:block absolute top-0 inset-x-0 bg-gradient-to-b from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
        <p className="text-white text-xs font-semibold truncate">{photo.uploader}</p>
        <p className="text-white/70 text-[10px]">{photo.uploadedAt}</p>
      </div>
    </motion.div>
  );
};

export default PhotoGrid;
