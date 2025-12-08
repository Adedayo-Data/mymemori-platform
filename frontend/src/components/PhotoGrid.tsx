import { Download, Heart } from "lucide-react";
import Masonry from "react-masonry-css";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useDoubleTap } from "../hooks/useDoubleTap";
import "../styles/masonry.css";

export interface Photo {
  photoId: string;  // Changed from id: number
  type: string;
  size: string;
  color: string;
  uploader: string;
  uploadedAt: string;
  imageUrl?: string;
  reactionCount?: number;
}

interface PhotoGridProps {
  photos: Photo[];
  viewMode: "grid" | "list";
  likedPhotos: Set<string>;  // Changed from Set<number>
  onPhotoClick: (photoId: string) => void;  // Changed from number
  onLike: (photoId: string) => void;  // Changed from number
  onDownload: (photoId: string) => void;  // Changed from number
  isAuthenticated?: boolean; // NEW: to control download permissions
}

const PhotoGrid = ({
  photos,
  viewMode,
  likedPhotos,
  onPhotoClick,
  onLike,
  onDownload,
  isAuthenticated = true, // Default to true for backward compatibility
}: PhotoGridProps) => {
  const [showHeartAnimation, setShowHeartAnimation] = useState < string | null > (null);

  // Masonry breakpoints
  const breakpointColumns = {
    default: 5,    // Large screens: 5 columns (was 4)
    1100: 4,       // Desktop: 4 columns (was 3)
    768: 3,        // Tablet: 3 columns (was 2)
    500: 2,        // Mobile: 2 columns (was 1)
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
            isAuthenticated={isAuthenticated}
          />
        ))}
      </Masonry>
    );
  }

  // List view (unchanged)
  return (
    <div className="space-y-3">
      {photos.map((photo) => (
        <div
          key={photo.photoId}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
          onClick={() => onPhotoClick(photo.photoId)}
        >
          <div className="flex items-center gap-4 flex-1">
            {photo.imageUrl ? (
              <img
                src={photo.imageUrl}
                alt={`Photo by ${photo.uploader}`}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div
                className={`w-16 h-16 rounded-lg bg-linear-to-br ${photo.color}`}
              ></div>
            )}
            <div>
              <p className="text-sm text-gray-600">
                Uploaded by {photo.uploader} <br />
                {photo.uploadedAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike(photo.photoId);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${likedPhotos.has(photo.photoId)
                  ? "fill-pink-600 text-pink-600"
                  : "text-gray-400"
                  }`}
              />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload(photo.photoId);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      ))}
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
  isAuthenticated?: boolean;
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
  isAuthenticated = true,
}: PhotoCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleTap = useDoubleTap({
    onDoubleTap: () => onDoubleTapLike(photo.photoId),
    onSingleTap: () => onPhotoClick(photo.photoId),
    delay: 300,
  });

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      // Show tooltip or toast for guest users
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
      return;
    }
    onDownload(photo.photoId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="relative group overflow-hidden rounded-2xl cursor-pointer transition-all hover:shadow-xl"
      style={{
        background: !imageLoaded ? `linear-gradient(135deg, ${photo.color})` : 'transparent',
      }}
      onClick={handleTap}
    >
      {/* Photo Image */}
      {photo.imageUrl ? (
        <img
          src={photo.imageUrl}
          alt={`Photo by ${photo.uploader}`}
          className={`w-full h-auto object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
      ) : (
        <div className="w-full h-64 flex items-center justify-center">
          <span className="text-white/40 text-4xl font-bold">{photo.photoId}</span>
        </div>
      )}

      {/* Hover overlay for desktop */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300"></div>

      {/* Double-tap heart animation */}
      <AnimatePresence>
        {showHeartAnimation && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <Heart className="w-24 h-24 fill-white text-white drop-shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ALWAYS VISIBLE on MOBILE: Bottom action badges (hidden on desktop) */}
      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between z-10 md:hidden">
        {/* Like button with counter - ALWAYS VISIBLE */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onLike(photo.photoId);
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors shadow-lg group/like"
          title="Like"
        >
          <Heart
            className={`w-4 h-4 transition-all ${
              isLiked 
                ? "fill-pink-500 text-pink-500 scale-110" 
                : "text-white group-hover/like:text-pink-400"
            }`}
          />
          {photo.reactionCount !== undefined && photo.reactionCount > 0 && (
            <span className="text-white text-xs font-semibold">
              {photo.reactionCount > 99 ? '99+' : photo.reactionCount}
            </span>
          )}
        </motion.button>

        {/* Download button - ALWAYS VISIBLE with permission state */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDownloadClick}
          className={`relative p-2 rounded-full shadow-lg transition-all ${
            isAuthenticated
              ? "bg-black/60 backdrop-blur-sm hover:bg-black/80"
              : "bg-gray-600/70 backdrop-blur-sm cursor-not-allowed"
          }`}
          title={isAuthenticated ? "Download" : "Sign up to download"}
        >
          <Download 
            className={`w-4 h-4 ${
              isAuthenticated ? "text-white" : "text-gray-300"
            }`} 
          />
          {!isAuthenticated && (
            <div className="absolute -top-1 -right-1 bg-pink-600 rounded-full p-0.5">
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </motion.button>
      </div>

      {/* Desktop-only: Hover action buttons (centered) */}
      <div className="hidden md:flex absolute inset-0 items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onLike(photo.photoId);
            }}
            className="p-3 bg-white rounded-full hover:bg-pink-50 transition-colors shadow-xl"
            title="Like"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${isLiked ? "fill-pink-600 text-pink-600" : "text-gray-700"
                }`}
            />
          </motion.button>

          <motion.button
            whileHover={{ scale: isAuthenticated ? 1.15 : 1 }}
            whileTap={{ scale: isAuthenticated ? 0.9 : 1 }}
            onClick={handleDownloadClick}
            className={`p-3 rounded-full transition-colors shadow-xl ${
              isAuthenticated
                ? "bg-white hover:bg-green-50 cursor-pointer"
                : "bg-gray-200 cursor-not-allowed"
            }`}
            title={isAuthenticated ? "Download" : "Sign up to download"}
          >
            <Download className={`w-5 h-5 ${isAuthenticated ? "text-gray-700" : "text-gray-400"}`} />
          </motion.button>
        </div>
      </div>

      {/* Photo info on desktop hover */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <p className="text-white text-sm font-medium">{photo.uploader}</p>
        <p className="text-white/70 text-xs">{photo.uploadedAt}</p>
      </div>

      {/* Loading skeleton overlay */}
      {!imageLoaded && photo.imageUrl && (
        <div className="absolute inset-0 skeleton"></div>
      )}
    </motion.div>
  );
};

export default PhotoGrid;
