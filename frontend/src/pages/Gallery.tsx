import { useState, useRef, useEffect } from "react";
import { Upload, Loader2, Camera } from "lucide-react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Masonry from "react-masonry-css";

import GalleryHeader from "../components/GalleryHeader";
import GalleryFilters from "../components/GalleryFilters";
import PhotoGrid from "../components/PhotoGrid";
import EnhancedPhotoModal from "../components/EnhancedPhotoModal";
import UploadModal from "../components/UploadModal";
import PhotoSkeleton from "../components/PhotoSkeleton";
import FloatingUploadIndicator from "../components/FloatingUploadIndicator";
import SignupPromptModal from "../components/SignupPromptModal";
import UploadUnlockOverlay from "../components/UploadUnlockOverlay";
import UnlockSuccessModal from "../components/UnlockSuccessModal";
// import StickyUploadBanner from "../components/StickyUploadBanner"; // Removed sticky banner
import { useEvent } from "../context/eventContext";
import { usePicture } from "../context/pictureContext";
import { useAuth } from "../context/authContext";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { downloadImage } from "../utils/downloadUtils";
import { uploadQueueManager } from "../utils/uploadQueueManager";
import type { UploadTask } from "../utils/uploadQueueManager";
import apiClient from "../api/apiClient";
import { addReaction } from "../api/reactionApi";

interface Photo {
  photoId: string;
  imageUrl: string;
  uploader: string;
  uploadedAt: string;
  type: string;
  size: string;
  color: string;
}

const Gallery = () => {
  // State management
  const [viewMode, setViewMode] = useState < "grid" | "list" > ("grid");
  const [selectedFilter, setSelectedFilter] = useState < string > ("all");
  const [sortBy, setSortBy] = useState < string > ("recent");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState < number | null > (null);
  const [likedPhotos, setLikedPhotos] = useState < Set < string >> (new Set());
  const [showUploadModal, setShowUploadModal] = useState < boolean > (false);
  const [showSignupPrompt, setShowSignupPrompt] = useState < boolean > (false);
  const [isLoading, setIsLoading] = useState < boolean > (true);
  const [eventData, setEventData] = useState < { title: string; date: string } > ({
    title: "Gallery",
    date: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState < boolean > (false);
  const [currentEventSlug, setCurrentEventSlug] = useState < string | null > (null);
  const [hasUploaded, setHasUploaded] = useState < boolean > (false);
  const [showSuccessModal, setShowSuccessModal] = useState < boolean > (false);
  const [hasShownUnlockModal, setHasShownUnlockModal] = useState < boolean > (false);
  // const [showStickyBanner, setShowStickyBanner] = useState<boolean>(false); // Removed sticky banner

  // Refs
  const fileInputRef = useRef < HTMLInputElement > (null);
  const cameraInputRef = useRef < HTMLInputElement > (null);

  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { getSessionContext } = useAuth();
  const { getEventBySlug } = useEvent();
  const {
    uploadedPhotos: contextPhotos,
    addUploadedPhoto,
    fetchDefaultImages,
    loading: isUploading,
  } = usePicture();

  // Categories for filtering
  const categories = ["all", "uploaded",];

  // Track if we've already loaded data to prevent multiple loads
  const hasLoadedRef = useRef(false);

  // Load data on component mount or when auth state changes
  useEffect(() => {
    // Only run this effect once on mount or when auth state changes
    if (hasLoadedRef.current) return;

    const loadData = async () => {
      try {
        setIsLoading(true);

        // Get event slug from URL or state
        const slug = searchParams.get("event") || location.state?.slug;

        if (!slug) {
          toast.error("Event information is missing");
          navigate("/");
          return;
        }

        // Store the slug for later use (e.g., in returnTo URL)
        setCurrentEventSlug(slug);

        // Clean up URL - remove the event query parameter to keep URL clean
        // The slug is now stored in state, so we don't need it in the URL
        if (searchParams.get("event")) {
          navigate("/gallery", { replace: true, state: { slug } });
        }

        const sessionContext = await getSessionContext(
          searchParams,
          location.state
        );
        const { isAuthenticated, sessionId } = sessionContext;

        // Update isAuthenticated state
        setIsAuthenticated(isAuthenticated);

        // Fetch event details
        try {
          const data = await getEventBySlug(slug);
          setEventData({
            title: data.eventName || "Gallery",
            date: data.eventDate || "",
          });
        } catch (error) {
          console.error("Failed to load event details:", error);
          toast.error("Failed to load event details");
        }

        // Fetch photos
        await fetchDefaultImages(slug, sessionId);

        // Check if user has uploaded
        try {
          const headers: Record<string, string> = {};

          // Add session ID for guest users so backend can check their upload status
          if (!isAuthenticated && sessionId) {
            headers['X-Session-Id'] = sessionId;
          }

          const uploadCheckResponse = await apiClient.get("/api/public/upload-status", {
            params: { eventSlug: slug },
            headers,
          });
          setHasUploaded(uploadCheckResponse.data.hasUploaded || false);
        } catch (error) {
          console.error("Failed to check upload status:", error);
          // Default to false if check fails
          setHasUploaded(false);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading gallery data:", error);
        toast.error("Failed to load gallery. Please try again.");
        setIsLoading(false);
      }
    };

    loadData();
    hasLoadedRef.current = true;

    // Cleanup function
    return () => {
      hasLoadedRef.current = false;
    };
  }, [
    getSessionContext,
    getEventBySlug,
    fetchDefaultImages,
    navigate,
    location.state,
    searchParams,
  ]);

  // Helper function to get a random gradient
  const getRandomGradient = () => {
    const gradients = [
      "from-blue-100 to-indigo-100",
      "from-pink-100 to-rose-100",
      "from-green-100 to-emerald-100",
      "from-purple-100 to-violet-100",
      "from-amber-100 to-orange-100",
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  // Additional effect to handle the case where default images are already loaded
  useEffect(() => {
    if (contextPhotos.length > 0 && isLoading) {
      setIsLoading(false);
    }
  }, [contextPhotos, isLoading]);

  // Initialize liked photos from contextPhotos (when they load or change)
  useEffect(() => {
    if (contextPhotos.length > 0) {
      const likedPhotoIds = new Set < string > ();
      contextPhotos.forEach((photo: any) => {
        if (photo.isLikedByCurrentUser) {
          likedPhotoIds.add(photo.photoId);
        }
      });

      if (likedPhotoIds.size > 0) {
        setLikedPhotos(likedPhotoIds);
      }
    }
  }, [contextPhotos]);

  // Handle file selection - Add to background upload queue
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      // Get session context and event slug
      const { isAuthenticated, sessionId } = await getSessionContext(
        searchParams,
        location.state
      );
      const slug = searchParams.get("event") || location.state?.slug;

      if (!slug) {
        toast.error("Event information is missing");
        return;
      }

      // Filter out non-image files
      const imageFiles = Array.from(files).filter(file => {
        if (!file.type.startsWith("image/")) {
          toast.error(`Skipped ${file.name}: Not an image file`);
          return false;
        }
        return true;
      });

      if (imageFiles.length === 0) {
        toast.error("No valid image files selected");
        return;
      }

      // Add to background upload queue
      await uploadQueueManager.addToQueue(imageFiles, {
        eventSlug: slug,
        sessionId,
        isAuthenticated,
      });

      // Close modal
      setShowUploadModal(false);
    } catch (error) {
      console.error("Failed to add files to queue:", error);
      toast.error("Failed to start upload");
    } finally {
      // Reset file input
      if (e.target) e.target.value = "";
    }
  };

  // Handle camera capture - Add to background upload queue
  const handleCameraCapture = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      // Get session context and event slug
      const { isAuthenticated, sessionId } = await getSessionContext(
        searchParams,
        location.state
      );
      const slug = searchParams.get("event") || location.state?.slug;

      if (!slug) {
        toast.error("Event information is missing");
        return;
      }

      // Add all captured photos to upload queue
      const imageFiles = Array.from(files);
      await uploadQueueManager.addToQueue(imageFiles, {
        eventSlug: slug,
        sessionId,
        isAuthenticated,
      });

      // Close modal
      setShowUploadModal(false);
    } catch (error) {
      console.error("Failed to process captured photos:", error);
      toast.error("Failed to start upload");
    } finally {
      // Reset the input to allow capturing another photo
      if (e.target) e.target.value = "";
    }
  };

  // Handle photo like
  const handleLike = async (photoId: string) => {
    try {
      // Get session context
      const { isAuthenticated, sessionId: currentSessionId } = await getSessionContext(
        searchParams,
        location.state
      );

      const isCurrentlyLiked = likedPhotos.has(photoId);

      // Optimistic update
      setLikedPhotos((prev) => {
        const newLiked = new Set(prev);
        if (isCurrentlyLiked) {
          newLiked.delete(photoId);
        } else {
          newLiked.add(photoId);
        }
        return newLiked;
      });

      // Call API - backend handles toggle (like/unlike)
      await addReaction(photoId, !isAuthenticated ? currentSessionId : undefined);

      // Refresh gallery to get updated reaction counts
      const slug = searchParams.get("event") || location.state?.slug;
      if (slug) {
        await fetchDefaultImages(slug);
      }
    } catch (error: any) {
      console.error("Failed to update reaction:", error);

      // Revert optimistic update on error
      setLikedPhotos((prev) => {
        const newLiked = new Set(prev);
        if (newLiked.has(photoId)) {
          newLiked.delete(photoId);
        } else {
          newLiked.add(photoId);
        }
        return newLiked;
      });

      // Only show error for non-toggle errors
      if (!error.response?.data?.message?.includes("already reacted")) {
        toast.error("Failed to update reaction");
      }
    }
  };

  // Handle photo download
  const handleDownload = (photoId: string) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Session user trying to download - show signup prompt
      setShowSignupPrompt(true);
      return;
    }

    // Authenticated user - proceed with download
    const photo = contextPhotos.find((p) => p.photoId === photoId);
    if (photo) {
      downloadImage(photo.imageUrl, `MyMemori-Photo-${photoId}.jpg`);
    }
  };

  // Handle completed uploads from background queue
  const handleUploadComplete = async (task: UploadTask) => {
    try {
      const { eventSlug, sessionId, isAuthenticated } = task.metadata;

      if (!task.imageUrl) return;

      // Save to backend using the correct endpoint
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        };

        // Add session ID to header for guest users
        if (!isAuthenticated && sessionId) {
          headers['X-Session-Id'] = sessionId;
        }

        await apiClient.post(
          '/api/public/save-image',
          {
            eventSlug,
            imageUrl: [task.imageUrl], // Backend expects an array
          },
          { headers }
        );

        // Add to local gallery optimistically (will be deduplicated when backend returns)
        const newPhoto: Photo = {
          photoId: `temp-${Date.now()}`, // Temporary ID
          imageUrl: task.imageUrl,
          uploader: isAuthenticated ? "You" : "Guest",
          uploadedAt: "Just now",
          type: "uploaded",
          size: "medium",
          color: getRandomGradient(),
        };

        addUploadedPhoto(newPhoto);

        // FOMO Strategy: Refresh gallery to show all photos after first upload
        // This will fetch all photos from backend since user has now uploaded
        // CRITICAL: Pass the SAME sessionId to ensure backend checks the correct session
        await fetchDefaultImages(eventSlug, sessionId);

        // Update state to unlock all photos and dismiss overlay
        // Only show modal on FIRST upload that unlocks gallery (locked → unlocked transition)
        // If user already uploaded (hasUploaded=true) or modal already shown, don't show again
        if (!hasUploaded && !hasShownUnlockModal) {
          setShowSuccessModal(true);
          setHasShownUnlockModal(true);
        }
        setHasUploaded(true);

      } catch (saveError: any) {
        console.error('Failed to save image to backend:', saveError);
        if (saveError.response) {
          console.error('Server response:', saveError.response.data);
        }
        toast.error('Image uploaded but failed to save to gallery');
      }
    } catch (error) {
      console.error("Failed to process uploaded photo:", error);
    }
  };

  // Filter and sort photos
  const filteredPhotos = contextPhotos.filter(
    (photo) => selectedFilter === "all" || photo.type === selectedFilter
  );

  const sortedPhotos = [...filteredPhotos].sort((a, b) => {
    if (sortBy === "recent") {
      // Sort by photoId (assuming it's timestamp based for uploaded photos)
      return b.photoId.localeCompare(a.photoId);
    }
    return 0;
  });



  // Infinite scroll for performance
  const { displayedItems } = useInfiniteScroll({
    items: sortedPhotos,
    batchSize: 20,
  });

  // FOMO: Backend already limits to 10 photos if user hasn't uploaded
  // We just need to show the unlock message when hasUploaded = false
  const shouldShowUnlock = !hasUploaded && sortedPhotos.length >= 10;

  // Removed sticky banner functionality
  // useEffect(() => {
  //   if (shouldShowUnlock && !showStickyBanner) {
  //     const timer = setTimeout(() => {
  //       setShowStickyBanner(true);
  //     }, 30000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [shouldShowUnlock, showStickyBanner]);



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <GalleryHeader
            eventTitle={eventData.title}
            eventDate={eventData.date}
            photoCount={sortedPhotos.length}
          // onDownloadAll={() => toast.success("Preparing download...")} // Commented out download all
          />

          {/* Filters */}
          <div className="mt-4">
            <GalleryFilters
              sortBy={sortBy}
              selectedFilter={selectedFilter}
              viewMode={viewMode}
              onSortChange={setSortBy}
              onFilterChange={setSelectedFilter}
              onViewModeChange={setViewMode}
              categories={categories}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      {isLoading ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Masonry
            breakpointCols={{ default: 5, 1100: 4, 768: 3, 500: 2 }}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
          >
            <PhotoSkeleton count={15} />
          </Masonry>
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {sortedPhotos.length > 0 ? (
            <>
              <PhotoGrid
                photos={sortedPhotos}
                viewMode={viewMode}
                likedPhotos={likedPhotos}
                onPhotoClick={(photoId) => {
                  const index = sortedPhotos.findIndex(p => p.photoId === photoId);
                  setSelectedPhotoIndex(index);
                }}
                onLike={handleLike}
                onDownload={handleDownload}
                isAuthenticated={isAuthenticated}
              />

              {/* Unlock message - shown when user hasn't uploaded */}
              {shouldShowUnlock && (
                <div className="mt-8">
                  <UploadUnlockOverlay
                    photoCount={0} // Backend doesn't tell us total count
                    onUploadClick={() => setShowUploadModal(true)}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-24 h-24 bg-linear-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Camera className="w-10 h-10 text-pink-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No photos yet
              </h3>
              <p className="text-gray-500 max-w-md mb-8 text-lg">
                Be the first to capture the moment! Upload a photo to start the gallery.
              </p>
            </div>
          )}
        </main>
      )}

      {/* Upload Button (Mobile) */}
      <div className="fixed bottom-20 right-4 z-10">
        <button
          onClick={() => setShowUploadModal(true)}
          className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 px-4 sm:px-6 py-3 sm:py-4 bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full font-semibold shadow-2xl hover:shadow-pink-500/50 transition-all flex items-center gap-2 hover:scale-105 z-10"
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Upload className="w-6 h-6" />
          )}
          <span className="hidden sm:inline">Upload Photo</span>
        </button>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onGallerySelect={() => {
          fileInputRef.current?.click();
          setShowUploadModal(false);
        }}
        onCameraSelect={() => {
          cameraInputRef.current?.click();
          setShowUploadModal(false);
        }}
      />

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
      />
      <input
        type="file"
        ref={cameraInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        multiple
        onChange={handleCameraCapture}
      />

      {/* Floating Upload Indicator */}
      <FloatingUploadIndicator onTaskComplete={handleUploadComplete} />


      {/* Enhanced Photo Modal */}
      {selectedPhotoIndex !== null && (
        <EnhancedPhotoModal
          photos={displayedItems}
          currentIndex={selectedPhotoIndex}
          isLiked={likedPhotos.has(displayedItems[selectedPhotoIndex].photoId)}
          onClose={() => setSelectedPhotoIndex(null)}
          onLike={(photoId) => handleLike(photoId)}
          onDownload={(photoId) => handleDownload(photoId)}
          onNavigate={(index) => setSelectedPhotoIndex(index)}
        />
      )}

      {/* Signup Prompt Modal */}
      <SignupPromptModal
        isOpen={showSignupPrompt}
        onClose={() => {
          setShowSignupPrompt(false);
        }}
        returnTo={(() => {
          // Use the stored event slug to construct the return URL
          const returnUrl = currentEventSlug
            ? `/gallery?event=${currentEventSlug}`
            : "/gallery";
          return returnUrl;
        })()}
      />

      {/* Removed Sticky Upload Banner */}
      {/* <StickyUploadBanner
        isVisible={showStickyBanner && shouldShowUnlock}
        onUploadClick={() => setShowUploadModal(true)}
        onDismiss={() => setShowStickyBanner(false)}
      /> */}

      {/* Success Modal */}
      <UnlockSuccessModal
        isVisible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />



    </div>
  );
};

export default Gallery;
