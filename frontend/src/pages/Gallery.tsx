import { useState, useRef, useEffect } from "react";
import { Upload, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import BottomNav from "../components/BottomNav";
import GalleryHeader from "../components/GalleryHeader";
import GalleryFilters from "../components/GalleryFilters";
import PhotoGrid from "../components/PhotoGrid";
import PhotoModal from "../components/PhotoModal";
import UploadModal from "../components/UploadModal";
import { useEvent } from "../context/eventContext";
import { usePicture } from "../context/pictureContext";
import apiClient from "../api/apiClient";

interface Photo {
  id: number;
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
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Set<number>>(new Set());
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
  const { getEventBySlug } = useEvent();
  const {
    uploadImage,
    uploadedPhotos: contextPhotos,
    addUploadedPhoto,
    fetchDefaultImages,
  } = usePicture();

  // Categories for filtering
  const categories = [
    { value: "all", label: "All Photos" },
    { value: "uploaded", label: "Uploaded" },
    { value: "portrait", label: "Portraits" },
    { value: "landscape", label: "Landscapes" },
    { value: "group", label: "Group Photos" },
  ];

  // Track if we've already loaded data to prevent multiple loads
  const hasLoadedRef = useRef(false);

  // Load data on component mount
  useEffect(() => {
    // Only run this effect once on mount
    if (hasLoadedRef.current) return;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const { slug, sessionId } = location.state || {};
        
        if (!slug) {
          toast.error("Event information is missing");
          return;
        }
        
        // If we have a session ID from the Visit page, ensure it's stored
        if (sessionId) {
          localStorage.setItem('sessionId', sessionId);
        }
        
        // Fetch images with the current session
        await fetchDefaultImages(slug);
        
        // Get event details
        const data = await getEventBySlug(slug);
        setEventData({
          title: data.eventName || "Gallery",
          date: data.eventDate || "",
        });
      } catch (error) {
        console.error("Failed to load gallery data:", error);
        toast.error("Failed to load gallery. Please try again.");
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
  }, [location.state?.slug, getEventBySlug, fetchDefaultImages]);

  // Additional effect to handle the case where default images are already loaded
  useEffect(() => {
    if (contextPhotos.length > 0 && isLoading) {
      setIsLoading(false);
    }
  }, [contextPhotos, isLoading]);

  // Create a new session for non-authenticated users
  const createNewSession = async (eventSlug: string): Promise<string> => {
    try {
      const response = await apiClient.post('/api/public/create-session', {
        eventSlug,
        deviceType: 'web' // or detect device type if needed
      });
      
      const { sessionId } = response.data;
      if (!sessionId) throw new Error('No session ID in response');
      
      // Store the session ID for future use
      localStorage.setItem('sessionId', sessionId);
      console.log('Created new session:', sessionId);
      return sessionId;
    } catch (error) {
      console.error('Failed to create session:', error);
      throw new Error('Failed to create a new session');
    }
  };

  // Get existing session ID or create a new one
  const getSessionId = async (): Promise<string> => {
    // First try to get from localStorage
    let sessionId = localStorage.getItem('sessionId');
    
    // If not found, create a new session
    if (!sessionId && location.state?.slug) {
      sessionId = await createNewSession(location.state.slug);
    } else if (!sessionId) {
      throw new Error('Event slug is required to create a session');
    }
    
    console.log('Using session ID:', sessionId);
    return sessionId;
  };

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      // Get session ID and slug
      const sessionId = await getSessionId();
      const slug = location.state?.slug || "";
      
      console.log("Upload attempt with:", { sessionId, slug, locationState: location.state });

      if (!sessionId || !slug) {
        console.error("Validation failed - Missing:", { 
          hasSessionId: !!sessionId, 
          hasSlug: !!slug,
          locationState: location.state
        });
        
        if (!sessionId) {
          toast.error("Please log in to upload photos");
        } else if (!slug) {
          toast.error("Event information is missing. Please try accessing the gallery from the event page.");
        }
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
          // Upload to Cloudinary and save to backend
          const imageUrl = await uploadImage(file, sessionId, slug);

          // Add to local state
          const newPhoto: Photo = {
            id: Date.now() + i,
            imageUrl,
            uploader: "You",
            uploadedAt: "Just now",
            type: "uploaded",
            size: "medium",
            color: "from-blue-100 to-indigo-100",
          };

          addUploadedPhoto(newPhoto);
          toast.success(`Uploaded ${file.name}`);
        } catch (error) {
          console.error('Error in file upload:', error);
          toast.error('Failed to process file upload');
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload files");
    }
  };

  // Handle camera capture
  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Get session ID and slug
      const sessionId = await getSessionId();
      const slug = location.state?.slug || "";
      
      console.log("Upload attempt with:", { sessionId, slug, locationState: location.state });

      if (!sessionId || !slug) {
        console.error("Validation failed - Missing:", { 
          hasSessionId: !!sessionId, 
          hasSlug: !!slug,
          locationState: location.state
        });
        
        if (!sessionId) {
          toast.error("Please log in to upload photos");
        } else if (!slug) {
          toast.error("Event information is missing. Please try accessing the gallery from the event page.");
        }
        return;
      }

      // Process the captured image
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          // First upload to Cloudinary
          const imageUrl = await uploadImage(file, sessionId, slug);
          
          // Then add to local state
          const newPhoto: Photo = {
            id: Date.now(),
            imageUrl,
            uploader: "You",
            uploadedAt: "Just now",
            type: "uploaded",
            size: "medium",
            color: "from-green-100 to-teal-100",
          };

          addUploadedPhoto(newPhoto);
          toast.success("Photo captured and uploaded successfully!");
        } catch (error) {
          console.error("Failed to process captured photo:", error);
          toast.error("Failed to upload photo");
        }
      };
      reader.readAsDataURL(file);
      
      // Reset the input to allow capturing another photo
      if (e.target) {
        e.target.value = "";
      }
    } catch (error) {
      console.error("Failed to process captured photo:", error);
      toast.error("Failed to upload photo");
    }
  };

  // Handle photo like
  const handleLike = (photoId: number) => {
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
  const handleDownload = (photoId: number) => {
    const photo = contextPhotos.find((p) => p.id === photoId);
    if (photo) {
      // In a real app, you would implement actual download logic here
      console.log("Downloading:", photo.imageUrl);
      toast.success("Download started!");
    }
  };

  // Filter and sort photos
  const filteredPhotos = contextPhotos.filter(
    (photo) => selectedFilter === "all" || photo.type === selectedFilter
  );

  const sortedPhotos = [...filteredPhotos].sort((a, b) => {
    if (sortBy === "recent") {
      return b.id - a.id; // Sort by ID (newest first)
    }
    return 0;
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <GalleryHeader
            eventTitle={eventData.title}
            eventDate={eventData.date}
            photoCount={sortedPhotos.length}
            onBack={() => navigate(-1)}
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
              categories={categories.map((cat) => cat.value)}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          </div>
        ) : sortedPhotos.length > 0 ? (
          <PhotoGrid
            photos={sortedPhotos}
            viewMode={viewMode}
            likedPhotos={likedPhotos}
            onPhotoClick={setSelectedPhoto}
            onLike={handleLike}
            onDownload={handleDownload}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No photos yet
            </h3>
            <p className="text-gray-500 max-w-md mb-6">
              Get started by uploading your first photo to the gallery.
            </p>
          </div>
        )}
      </main>

      {/* Upload Button (Mobile) */}
      <div className="fixed bottom-20 right-4 z-10">
        <button
          onClick={() => setShowUploadModal(true)}
          className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 px-4 sm:px-6 py-3 sm:py-4 bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full font-semibold shadow-2xl hover:shadow-pink-500/50 transition-all flex items-center gap-2 hover:scale-105 z-10"
        >
          <Upload className="w-5 h-5" />
          <span className="hidden sm:inline">Upload Photo</span>
        </button>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onGallerySelect={() => fileInputRef.current?.click()}
        onCameraSelect={() => cameraInputRef.current?.click()}
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

      {/* Photo Modal */}
      {selectedPhoto !== null && (
        <PhotoModal
          photo={sortedPhotos.find((p) => p.id === selectedPhoto)!}
          isLiked={likedPhotos.has(selectedPhoto)}
          onClose={() => setSelectedPhoto(null)}
          onLike={() => handleLike(selectedPhoto)}
          onDownload={() => handleDownload(selectedPhoto)}
        />
      )}

      <div className="pb-20 md:pb-0">
        <BottomNav />
      </div>
    </div>
  );
};

export default Gallery;
