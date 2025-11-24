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
import { useEvent } from "../context/eventContext";
import { usePicture } from "../context/pictureContext";
import { useAuth } from "../context/authContext";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { downloadImage } from "../utils/downloadUtils";

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [eventData, setEventData] = useState<{ title: string; date: string }>({
    title: "Gallery",
    date: "",
  });

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { getSessionContext } = useAuth();
  const { getEventBySlug } = useEvent();
  const {
    uploadGalleryImage,
    uploadedPhotos: contextPhotos,
    addUploadedPhoto,
    fetchDefaultImages,
    loading: isUploading,
  } = usePicture();

  // Categories for filtering
  const categories = ["all", "uploaded", ];

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

        // Get session context
        const sessionContext = await getSessionContext(
          searchParams,
          location.state
        );
        const { isAuthenticated, sessionId, userId } = sessionContext;

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

        // Fetch photos based on auth state
        try {
          if (isAuthenticated && userId) {
            // For authenticated users, fetch their photos
            await fetchDefaultImages(slug);
          } else if (sessionId) {
            // For guests, fetch photos for this session
            await fetchDefaultImages(slug);
          }
        } catch (error) {
          console.error("Failed to load photos:", error);
          toast.error("Failed to load photos");
        }
      } catch (error) {
        console.error("Failed to initialize gallery:", error);
        // Error is already handled in getSessionContext
      } finally {
        setIsLoading(false);
        hasLoadedRef.current = true;
      }
    };

    loadData();

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

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      // Get session context and event slug
      const { isAuthenticated, sessionId, userId } = await getSessionContext(
        searchParams,
        location.state
      );
      const slug = searchParams.get("event") || location.state?.slug;

      if (!slug) {
        toast.error("Event information is missing");
        return;
      }

      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Check file type
        if (!file.type.startsWith("image/")) {
          toast.error(`Skipped ${file.name}: Not an image file`);
          continue;
        }

        try {
          let imageUrl: string;

          if (isAuthenticated && userId) {
            // Authenticated upload
            imageUrl = await uploadGalleryImage(file, userId, slug);
          } else if (sessionId) {
            // Guest upload
            imageUrl = await uploadGalleryImage(file, sessionId, slug);
          } else {
            throw new Error("No valid authentication");
          }

          // Add to local state
          const newPhoto: Photo = {
            photoId: (Date.now() + i).toString(),
            imageUrl,
            uploader: isAuthenticated ? "You" : "Guest",
            uploadedAt: "Just now",
            type: "uploaded",
            size: "medium",
            color: getRandomGradient(),
          };

          addUploadedPhoto(newPhoto);
          toast.success(`Uploaded ${file.name}`);
        } catch (error) {
          console.error("Error in file upload:", error);
          toast.error(`Failed to upload ${file.name}`);
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Please sign in or use a valid event link");
    } finally {
      // Reset file input
      if (e.target) e.target.value = "";
    }
  };

  // Handle camera capture
  const handleCameraCapture = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Get session context and event slug
      const { isAuthenticated, sessionId, userId } = await getSessionContext(
        searchParams,
        location.state
      );
      const slug = searchParams.get("event") || location.state?.slug;

      if (!slug) {
        toast.error("Event information is missing");
        return;
      }

      // Upload the captured image
      let imageUrl: string;

      if (isAuthenticated && userId) {
        imageUrl = await uploadGalleryImage(file, userId, slug);
      } else if (sessionId) {
        imageUrl = await uploadGalleryImage(file, sessionId, slug);
      } else {
        throw new Error("No valid authentication");
      }

      // Add to context
      const newPhoto: Photo = {
        photoId: Date.now().toString(),
        imageUrl,
        uploader: isAuthenticated ? "You" : "Guest",
        uploadedAt: "Just now",
        type: "uploaded",
        size: "medium",
        color: getRandomGradient(),
      };

      addUploadedPhoto(newPhoto);
      toast.success("Photo uploaded successfully!");
    } catch (error) {
      console.error("Failed to process captured photo:", error);
      toast.error("Failed to upload photo");
    } finally {
      // Reset the input to allow capturing another photo
      if (e.target) e.target.value = "";
    }
  };

  // Handle photo like
  const handleLike = (photoId: string) => {
    setLikedPhotos((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(photoId)) {
        newLiked.delete(photoId);
      } else {
        newLiked.add(photoId);
      }
      return newLiked;
    });
  };

  // Handle photo download
  const handleDownload = (photoId: string) => {
    const photo = contextPhotos.find((p) => p.photoId === photoId);
    if (photo) {
      downloadImage(photo.imageUrl, `photo-${photoId}.jpg`);
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
  const { displayedItems, hasMore, isLoadingMore, observerRef } = useInfiniteScroll({
    items: sortedPhotos,
    batchSize: 20,
  });



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <GalleryHeader
            eventTitle={eventData.title}
            eventDate={eventData.date}
            photoCount={sortedPhotos.length}
            onDownloadAll={() => toast.success("Preparing download...")}
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
          {displayedItems.length > 0 ? (
            <>
              <PhotoGrid
                photos={displayedItems}
                viewMode={viewMode}
                likedPhotos={likedPhotos}
                onPhotoClick={(photoId) => {
                  const index = displayedItems.findIndex(p => p.photoId === photoId);
                  setSelectedPhotoIndex(index);
                }}
                onLike={handleLike}
                onDownload={handleDownload}
              />
              
              {/* Loading indicator and observer target */}
              {hasMore && (
                <div 
                  ref={observerRef}
                  className="flex justify-center items-center py-8"
                >
                  {isLoadingMore && (
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-6 w-6 text-pink-600 animate-spin" />
                      <p className="text-gray-600 text-sm">Loading more photos...</p>
                    </div>
                  )}
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
        onChange={handleCameraCapture}
      />


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



    </div>
  );
};

export default Gallery;
