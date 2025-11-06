import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BottomNav from "../components/BottomNav";
import GalleryHeader from "../components/GalleryHeader";
import GalleryFilters from "../components/GalleryFilters";
import PhotoGrid from "../components/PhotoGrid";
import PhotoModal from "../components/PhotoModal";
import UploadModal from "../components/UploadModal";
import type { Photo } from "../components/PhotoGrid";

const Gallery = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Set<number>>(new Set());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const photos: Photo[] = [
    {
      id: 1,
      type: "portrait",
      size: "large",
      color: "from-pink-100 to-rose-100",
      uploader: "Sarah",
      uploadedAt: "2 hours ago",
    },
    {
      id: 2,
      type: "detail",
      size: "small",
      color: "from-amber-50 to-orange-50",
      uploader: "John",
      uploadedAt: "3 hours ago",
    },
    {
      id: 3,
      type: "venue",
      size: "small",
      color: "from-amber-800 to-orange-900",
      uploader: "Mike",
      uploadedAt: "4 hours ago",
    },
    {
      id: 4,
      type: "detail",
      size: "small",
      color: "from-slate-700 to-slate-900",
      uploader: "Emma",
      uploadedAt: "5 hours ago",
    },
    {
      id: 5,
      type: "bride",
      size: "small",
      color: "from-emerald-700 to-teal-800",
      uploader: "Lisa",
      uploadedAt: "6 hours ago",
    },
    {
      id: 6,
      type: "decor",
      size: "medium",
      color: "from-rose-100 to-pink-100",
      uploader: "Tom",
      uploadedAt: "1 day ago",
    },
    {
      id: 7,
      type: "couple",
      size: "medium",
      color: "from-red-900 to-rose-950",
      uploader: "Alex",
      uploadedAt: "1 day ago",
    },
    {
      id: 8,
      type: "venue",
      size: "small",
      color: "from-amber-600 to-orange-700",
      uploader: "Chris",
      uploadedAt: "2 days ago",
    },
    {
      id: 9,
      type: "couple",
      size: "small",
      color: "from-slate-100 to-gray-200",
      uploader: "Rachel",
      uploadedAt: "2 days ago",
    },
    {
      id: 10,
      type: "detail",
      size: "small",
      color: "from-emerald-50 to-teal-50",
      uploader: "David",
      uploadedAt: "3 days ago",
    },
    {
      id: 11,
      type: "group",
      size: "small",
      color: "from-blue-50 to-sky-100",
      uploader: "Jessica",
      uploadedAt: "3 days ago",
    },
    {
      id: 12,
      type: "celebration",
      size: "wide",
      color: "from-amber-900 to-orange-950",
      uploader: "Mark",
      uploadedAt: "4 days ago",
    },
  ];

  const handleUpload = () => {
    setShowUploadModal(true);
  };

  const handleGalleryUpload = () => {
    fileInputRef.current?.click();
  };

  const handleCameraUpload = () => {
    cameraInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);

      // Validate file types
      const validFiles = fileArray.filter((file) =>
        file.type.startsWith("image/")
      );
      if (validFiles.length !== fileArray.length) {
        toast.error("Only image files are allowed");
      }

      // Validate file sizes (max 10MB each)
      const oversizedFiles = validFiles.filter(
        (file) => file.size > 10 * 1024 * 1024
      );
      if (oversizedFiles.length > 0) {
        toast.error("Some images exceed 10MB limit");
        return;
      }

      setUploadedImages((prev) => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} photo(s) selected`);
      setShowUploadModal(false);

      // Here you would typically upload to your backend
      console.log("Files to upload:", validFiles);
    }
  };

  const handleLike = (photoId: number) => {
    const newLiked = new Set(likedPhotos);
    if (newLiked.has(photoId)) {
      newLiked.delete(photoId);
    } else {
      newLiked.add(photoId);
    }
    setLikedPhotos(newLiked);
  };

  const handleShare = (photoId: number) => {
    console.log("Sharing photo:", photoId);
    toast.success("Photo link copied to clipboard!");
  };

  const handleDownload = (photoId: number) => {
    console.log("Downloading photo:", photoId);
    toast.success("Photo downloaded!");
  };

  const filteredPhotos = photos.filter((photo) => {
    const matchesSearch =
      photo.uploader.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || photo.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const sortedPhotos = [...filteredPhotos].sort((a, b) => {
    if (sortBy === "recent") {
      return photos.indexOf(b) - photos.indexOf(a);
    }
    return 0;
  });

  // Event data - this would come from props or context in real app
  const eventData = {
    title: "Eleanor & James' Wedding",
    date: "Dec 14, 2024",
  };

  const handleDownloadAll = () => {
    toast.success("Downloading all photos...");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
      {/* Header - Mobile Optimized */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <GalleryHeader
            eventTitle={eventData.title}
            eventDate={eventData.date}
            photoCount={sortedPhotos.length}
            onBack={() => navigate("/profile")}
            onDownloadAll={handleDownloadAll}
          />

          <GalleryFilters
            sortBy={sortBy}
            selectedFilter={selectedFilter}
            viewMode={viewMode}
            onSortChange={setSortBy}
            onFilterChange={setSelectedFilter}
            onViewModeChange={setViewMode}
          />
        </div>
      </header>

      {/* Photo Grid/List */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <PhotoGrid
          photos={sortedPhotos}
          viewMode={viewMode as "grid" | "list"}
          likedPhotos={likedPhotos}
          onPhotoClick={setSelectedPhoto}
          onLike={handleLike}
          onShare={handleShare}
          onDownload={handleDownload}
        />

        {sortedPhotos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No photos found</p>
          </div>
        )}

        {/* Load More */}
        {sortedPhotos.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors border border-gray-200 rounded-lg hover:bg-gray-50">
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Photo Details Modal */}
      {selectedPhoto && (
        <PhotoModal
          photoId={selectedPhoto}
          isLiked={likedPhotos.has(selectedPhoto)}
          onClose={() => setSelectedPhoto(null)}
          onLike={handleLike}
          onShare={handleShare}
          onDownload={handleDownload}
        />
      )}

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onCameraUpload={handleCameraUpload}
        onGalleryUpload={handleGalleryUpload}
      />

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Floating Upload Button */}
      <button
        onClick={handleUpload}
        className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 px-4 sm:px-6 py-3 sm:py-4 bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full font-semibold shadow-2xl hover:shadow-pink-500/50 transition-all flex items-center gap-2 hover:scale-105 z-10"
      >
        <Upload className="w-5 h-5" />
        <span className="hidden sm:inline">Upload Photo</span>
      </button>
      <BottomNav />
    </div>
  );
};

export default Gallery;
