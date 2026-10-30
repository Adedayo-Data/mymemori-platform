import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Masonry from "react-masonry-css";
import { motion } from "framer-motion";

import PhotoGrid from "../components/PhotoGrid";
import EnhancedPhotoModal from "../components/EnhancedPhotoModal";
import UploadModal from "../components/UploadModal";
import PhotoSkeleton from "../components/PhotoSkeleton";
import FloatingUploadIndicator from "../components/FloatingUploadIndicator";
import SignupPromptModal from "../components/SignupPromptModal";
import UploadUnlockOverlay from "../components/UploadUnlockOverlay";
import UploadUnlockModal from "../components/UploadUnlockModal";
import UnlockSuccessModal from "../components/UnlockSuccessModal";
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
  reactionCount?: number;
  canDelete?: boolean;
}

const Gallery = () => {
  // View & filtering state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"all" | "my" | "recent" | "likes">("all");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showSignupPrompt, setShowSignupPrompt] = useState<boolean>(false);
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [eventData, setEventData] = useState<{ title: string; date: string }>({
    title: "Gallery",
    date: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentEventSlug, setCurrentEventSlug] = useState<string | null>(null);
  const [hasUploaded, setHasUploaded] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [hasShownUnlockModal, setHasShownUnlockModal] = useState<boolean>(false);
  const [showUploadUnlockModal, setShowUploadUnlockModal] = useState<boolean>(false);
  const [guestDownloadCount, setGuestDownloadCount] = useState<number>(() => {
    return parseInt(localStorage.getItem("_mm_sess_trk_id_d") || "0", 10);
  });

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { getSessionContext, isAuthenticated: authContextIsAuthenticated } = useAuth();
  const isUserAuthenticated = isAuthenticated || authContextIsAuthenticated;
  const { getEventBySlug } = useEvent();
  const {
    uploadedPhotos: contextPhotos,
    addUploadedPhoto,
    fetchDefaultImages,
    loading: isUploading,
    deletePhoto,
  } = usePicture();

  // Track if we've already loaded data to prevent multiple loads
  const hasLoadedRef = useRef(false);

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load data on component mount
  useEffect(() => {
    if (hasLoadedRef.current) return;

    const loadData = async () => {
      try {
        setIsLoading(true);

        const slug = searchParams.get("event") || location.state?.slug;

        if (!slug) {
          toast.error("Event information is missing");
          navigate("/home");
          return;
        }

        setCurrentEventSlug(slug);

        if (searchParams.get("event")) {
          navigate("/gallery", { replace: true, state: { slug } });
        }

        const sessionContext = await getSessionContext(
          searchParams,
          location.state
        );
        const { isAuthenticated: authed, sessionId } = sessionContext;
        setIsAuthenticated(authed);

        // Fetch event details
        try {
          const data = await getEventBySlug(slug);
          setEventData({
            title: data.eventName || "Gallery",
            date: data.eventDate || "",
          });
        } catch (error) {
          console.error("Failed to load event details:", error);
        }

        // Fetch photos
        await fetchDefaultImages(slug, sessionId);

        // Check if user has uploaded
        try {
          const headers: Record<string, string> = {};
          if (!authed && sessionId) {
            headers["X-Session-Id"] = sessionId;
          }

          const uploadCheckResponse = await apiClient.get("/api/public/upload-status", {
            params: { eventSlug: slug },
            headers,
          });
          setHasUploaded(uploadCheckResponse.data.hasUploaded || false);
        } catch (error) {
          console.error("Failed to check upload status:", error);
          setHasUploaded(false);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading gallery data:", error);
        toast.error("Failed to load gallery");
        setIsLoading(false);
      }
    };

    loadData();
    hasLoadedRef.current = true;

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

  // Handle case where default images are already loaded in context
  useEffect(() => {
    if (contextPhotos.length > 0 && isLoading) {
      setIsLoading(false);
    }
  }, [contextPhotos, isLoading]);

  // Initialize liked photos from contextPhotos
  useEffect(() => {
    if (contextPhotos.length > 0) {
      const likedPhotoIds = new Set<string>();
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

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const { isAuthenticated: authed, sessionId } = await getSessionContext(
        searchParams,
        location.state
      );
      const slug = currentEventSlug || searchParams.get("event") || location.state?.slug;

      if (!slug) {
        toast.error("Event information is missing");
        return;
      }

      const imageFiles = Array.from(files).filter((file) => {
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

      await uploadQueueManager.addToQueue(imageFiles, {
        eventSlug: slug,
        sessionId,
        isAuthenticated: authed,
      });

      setShowUploadModal(false);
    } catch (error) {
      console.error("Failed to add files to queue:", error);
      toast.error("Failed to start upload");
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  // Handle camera capture
  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const { isAuthenticated: authed, sessionId } = await getSessionContext(
        searchParams,
        location.state
      );
      const slug = currentEventSlug || searchParams.get("event") || location.state?.slug;

      if (!slug) {
        toast.error("Event information is missing");
        return;
      }

      const imageFiles = Array.from(files);
      await uploadQueueManager.addToQueue(imageFiles, {
        eventSlug: slug,
        sessionId,
        isAuthenticated: authed,
      });

      setShowUploadModal(false);
    } catch (error) {
      console.error("Failed to process captured photos:", error);
      toast.error("Failed to start upload");
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  // Handle photo like
  const handleLike = async (photoId: string) => {
    try {
      const { isAuthenticated: authed, sessionId: currentSessionId } = await getSessionContext(
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

      await addReaction(photoId, !authed ? currentSessionId : undefined);

      const slug = currentEventSlug || searchParams.get("event") || location.state?.slug;
      if (slug) {
        await fetchDefaultImages(slug);
      }
    } catch (error: any) {
      console.error("Failed to update reaction:", error);

      // Revert optimistic update
      setLikedPhotos((prev) => {
        const newLiked = new Set(prev);
        if (newLiked.has(photoId)) {
          newLiked.delete(photoId);
        } else {
          newLiked.add(photoId);
        }
        return newLiked;
      });

      if (!error.response?.data?.message?.includes("already reacted")) {
        toast.error("Failed to update reaction");
      }
    }
  };

  // Handle photo delete
  const handleDelete = async (photoId: string) => {
    try {
      await deletePhoto(photoId);
      toast.success("Photo deleted");
      if (selectedPhotoIndex !== null && sortedPhotos[selectedPhotoIndex]?.photoId === photoId) {
        setSelectedPhotoIndex(null);
      }
    } catch (error) {
      console.error("Failed to delete photo:", error);
      toast.error("Failed to delete photo");
    }
  };

  // Handle photo download
  const handleDownload = (photoId: string) => {
    if (!isAuthenticated) {
      const currentCount = parseInt(localStorage.getItem("_mm_sess_trk_id_d") || "0", 10);

      if (currentCount >= 6) {
        setShowSignupPrompt(true);
        return;
      } else {
        const nextCount = currentCount + 1;
        localStorage.setItem("_mm_sess_trk_id_d", nextCount.toString());
        setGuestDownloadCount(nextCount);
      }
    }

    const photo = contextPhotos.find((p) => p.photoId === photoId);
    if (photo && photo.imageUrl) {
      downloadImage(photo.imageUrl, `MyMemori-Photo-${photoId}.jpg`);
    }
  };

  // Handle completed uploads
  const handleUploadComplete = async (task: UploadTask) => {
    try {
      const { eventSlug, sessionId, isAuthenticated: authed } = task.metadata;
      if (!task.imageUrl) return;

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          Accept: "application/json",
        };

        if (!authed && sessionId) {
          headers["X-Session-Id"] = sessionId;
        }

        await apiClient.post(
          "/api/public/save-image",
          {
            eventSlug,
            imageUrl: [task.imageUrl],
          },
          { headers }
        );

        const newPhoto: Photo = {
          photoId: `temp-${Date.now()}`,
          imageUrl: task.imageUrl,
          uploader: authed ? "You" : "Guest",
          uploadedAt: "Just now",
          type: "uploaded",
          size: "medium",
          color: "from-pink-500/20 to-purple-500/20",
        };

        addUploadedPhoto(newPhoto);
        await fetchDefaultImages(eventSlug, sessionId);

        if (!hasUploaded && !hasShownUnlockModal) {
          setShowSuccessModal(true);
          setHasShownUnlockModal(true);
        }
        setHasUploaded(true);
      } catch (saveError: any) {
        console.error("Failed to save image to backend:", saveError);
        toast.error("Image uploaded but failed to save to gallery");
      }
    } catch (error) {
      console.error("Failed to process uploaded photo:", error);
    }
  };

  // Filter photos
  const filteredPhotos = contextPhotos.filter((photo) => {
    if (activeTab === "my") {
      return photo.type === "uploaded" || photo.uploader === "You" || photo.uploader === "Guest";
    }
    return true;
  });

  // Sort photos
  const sortedPhotos = [...filteredPhotos].sort((a, b) => {
    if (activeTab === "likes") {
      return (b.reactionCount || 0) - (a.reactionCount || 0);
    }
    // "recent" and default: newest first
    return b.photoId.localeCompare(a.photoId);
  });

  // Infinite scroll for performance
  const { displayedItems, observerRef, hasMore, isLoadingMore } = useInfiniteScroll({
    items: sortedPhotos,
    batchSize: 20,
  });

  const shouldShowUnlock = !hasUploaded && sortedPhotos.length >= 10;


  // Copy share invite link
  const handleCopyLink = () => {
    const url = currentEventSlug 
      ? `${window.location.origin}/visit/${currentEventSlug}`
      : window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Event link copied!");
    setShowMoreMenu(false);
  };

  return (
    <div className="bg-[#131318] text-[#e4e1e9] min-h-screen relative overflow-x-hidden">
      {/* Ambient Mesh Background */}
      <div className="mesh-bg">
        <div className="mesh-blob blob-1" />
        <div className="mesh-blob blob-2" />
        <div className="mesh-blob blob-3" />
      </div>

      {/* TopAppBar */}
      <header className="flex justify-between items-center px-4 sm:px-8 h-16 w-full fixed top-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10 text-primary">
        {/* Left Action: Home Button for authenticated users, nothing for unauthenticated users */}
        {isUserAuthenticated ? (
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors scale-95 active:scale-90 duration-200 text-[#debec8] hover:text-white cursor-pointer"
            title="Home"
          >
            <span className="material-symbols-outlined">home</span>
          </button>
        ) : (
          <div className="w-10 h-10" />
        )}

        {/* Event Title */}
        <h1 className="font-headline-lg-mobile text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent truncate max-w-[200px] sm:max-w-md text-center">
          {eventData.title || "Summer Gala '24"}
        </h1>

        {/* More Options Button */}
        <div className="relative" ref={moreMenuRef}>
          <button
            type="button"
            onClick={() => setShowMoreMenu((prev) => !prev)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors scale-95 active:scale-90 duration-200 text-[#debec8] cursor-pointer"
            title="More Options"
          >
            <span className="material-symbols-outlined">more_vert</span>
          </button>

          {/* More Options Dropdown */}
          {showMoreMenu && (
            <div className="absolute right-0 top-12 w-48 bg-[#1f1f25]/95 border border-white/15 rounded-2xl shadow-2xl backdrop-blur-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full px-4 py-2.5 text-left text-sm text-[#e4e1e9] hover:bg-white/10 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#ffb0cd]">share</span>
                <span>Share Event</span>
              </button>

              {currentEventSlug && (
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/visit/${currentEventSlug}`);
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-[#e4e1e9] hover:bg-white/10 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#ddb7ff]">celebration</span>
                  <span>Event Landing</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
                  setShowMoreMenu(false);
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-[#e4e1e9] hover:bg-white/10 flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#debec8]">
                  {viewMode === "grid" ? "view_list" : "grid_view"}
                </span>
                <span>{viewMode === "grid" ? "List View" : "Grid View"}</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Filter Tabs Bar */}
      <div className="fixed top-16 left-0 w-full z-40 bg-[#131318]/75 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="flex items-center justify-between gap-4 px-4 sm:px-8 py-2.5 max-w-7xl mx-auto">
          {/* Tabs Segmented Glass Dock */}
          <div className="w-full md:w-auto flex items-center justify-between md:justify-start gap-1 p-1 bg-white/[0.04] md:bg-white/[0.06] border border-white/10 rounded-full backdrop-blur-xl shadow-lg">
            {[
              { id: "all", label: "All Photos", icon: "auto_awesome" },
              { id: "recent", label: "Recent", icon: "schedule" },
              { id: "likes", label: "Most Liked", icon: "favorite" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 md:flex-initial justify-center relative px-3 sm:px-4 py-2 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap active:scale-95 ${
                    isActive
                      ? "text-[#40000d]"
                      : "text-[#debec8] hover:text-white hover:bg-white/5"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilterTab"
                      className="absolute inset-0 bg-gradient-to-r from-[#ffb0cd] to-[#ddb7ff] rounded-full shadow-[0_0_20px_rgba(255,176,205,0.35)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
                    />
                  )}
                  <span
                    className="material-symbols-outlined text-[16px] sm:text-[18px] relative z-10"
                    style={{
                      fontVariationSettings:
                        isActive && tab.id === "likes" ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    {tab.icon}
                  </span>
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right side info & view switcher on desktop */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {/* Photo Counter Pill */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#debec8] bg-white/[0.04] px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb0cd] animate-pulse" />
              <span>
                {sortedPhotos.length} {sortedPhotos.length === 1 ? "memory" : "memories"}
              </span>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white/[0.04] border border-white/10 rounded-full p-1 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-[#ffb0cd]/30 to-[#ddb7ff]/30 text-white shadow-sm border border-white/15"
                    : "text-[#debec8]/60 hover:text-white"
                }`}
                title="Grid view"
              >
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-[#ffb0cd]/30 to-[#ddb7ff]/30 text-white shadow-sm border border-white/15"
                    : "text-[#debec8]/60 hover:text-white"
                }`}
                title="List view"
              >
                <span className="material-symbols-outlined text-[18px]">view_list</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Canvas */}
      <main className="min-h-screen relative z-10 pt-[144px] pb-28 md:pb-16 max-w-7xl mx-auto px-4 sm:px-6">
        {isLoading ? (
          <Masonry
            breakpointCols={{ default: 5, 1280: 4, 900: 3, 640: 2 }}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
          >
            <PhotoSkeleton count={12} />
          </Masonry>
        ) : sortedPhotos.length > 0 ? (
          <>
            <PhotoGrid
              photos={displayedItems}
              viewMode={viewMode}
              likedPhotos={likedPhotos}
              onPhotoClick={(photoId) => {
                const index = sortedPhotos.findIndex((p) => p.photoId === photoId);
                setSelectedPhotoIndex(index);
              }}
              onLike={handleLike}
              onDownload={handleDownload}
              onDelete={isAuthenticated ? handleDelete : undefined}
              isAuthenticated={isUserAuthenticated}
              isDownloadLocked={!isUserAuthenticated && guestDownloadCount >= 6}
            />

            {/* Unlock message - shown when user hasn't uploaded */}
            {shouldShowUnlock && (
              <div className="mt-8 cursor-pointer" onClick={() => setShowUploadUnlockModal(true)}>
                <UploadUnlockOverlay
                  photoCount={sortedPhotos.length}
                  onUploadClick={() => setShowUploadUnlockModal(true)}
                />
              </div>
            )}

            {/* Infinite scroll sentinel */}
            {hasMore && (
              <div ref={observerRef} className="flex justify-center py-8">
                {isLoadingMore && (
                  <div className="flex items-center gap-2 text-[#debec8]/50">
                    <div className="w-5 h-5 border-2 border-[#ffb0cd]/40 border-t-[#ffb0cd] rounded-full animate-spin" />
                    <span className="text-sm">Loading more photos...</span>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5 backdrop-blur-xl shadow-xl">
              <span className="material-symbols-outlined text-4xl text-[#ffb0cd]">
                photo_camera
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 font-headline-lg-mobile">
              No photos yet
            </h3>
            <p className="text-[#debec8] max-w-md mb-8 text-base">
              Be the first to capture the moment! Upload a photo to kick off the gallery.
            </p>
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-[#40000d] font-bold shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined">upload</span>
              <span>Upload First Photo</span>
            </button>
          </div>
        )}
      </main>

      {/* Floating Upload FAB */}
      <div className="fixed bottom-20 md:bottom-8 right-4 sm:right-8 z-40">
        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          disabled={isUploading}
          className="px-5 py-5 bg-gradient-to-r from-[#f751a1] to-[#ddb7ff] hover:brightness-110 text-[#40000d] font-bold rounded-full shadow-2xl shadow-primary/30 flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          {isUploading ? (
            <div className="w-5 h-5 border-2 border-[#40000d] border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="material-symbols-outlined text-[22px]">photo_camera</span>
          )}
          <span className="hidden sm:inline font-semibold">Upload Photo</span>
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
      {selectedPhotoIndex !== null && sortedPhotos[selectedPhotoIndex] && (
        <EnhancedPhotoModal
          photos={sortedPhotos}
          currentIndex={selectedPhotoIndex}
          isLiked={likedPhotos.has(sortedPhotos[selectedPhotoIndex].photoId)}
          onClose={() => setSelectedPhotoIndex(null)}
          onLike={(photoId) => handleLike(photoId)}
          onDownload={(photoId) => handleDownload(photoId)}
          onNavigate={(index) => setSelectedPhotoIndex(index)}
        />
      )}

      {/* Signup Prompt Modal */}
      <SignupPromptModal
        isOpen={showSignupPrompt}
        onClose={() => setShowSignupPrompt(false)}
        returnTo={
          currentEventSlug
            ? `/gallery?event=${currentEventSlug}`
            : "/gallery"
        }
      />

      {/* Upload to See More Images Modal */}
      <UploadUnlockModal
        isOpen={showUploadUnlockModal}
        onClose={() => setShowUploadUnlockModal(false)}
        onUploadClick={() => {
          setShowUploadUnlockModal(false);
          setShowUploadModal(true);
        }}
        photoCount={sortedPhotos.length}
      />

      {/* Success Modal */}
      <UnlockSuccessModal
        isVisible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default Gallery;
