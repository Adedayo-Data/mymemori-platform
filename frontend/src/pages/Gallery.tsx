import { useState } from "react";
import {
  Upload,
  Download,
  ChevronDown,
  Grid3x3,
  List,
  ArrowLeft,
  Search,
  X,
  Heart,
  Share2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Gallery = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const photos = [
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
    toast.success("Opening photo upload...");
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
    toast.success("Photo link copied to clipboard!");
  };

  const handleDownload = (photoId: number) => {
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

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => navigate("/profile")}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Eleanor & James' Wedding
                </h1>
                <p className="text-sm text-gray-500">
                  {sortedPhotos.length} photos • December 14, 2024
                </p>
              </div>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors font-medium">
              <Download className="w-4 h-4" />
              <span className="text-sm">Download All</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by uploader or photo type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex flex-wrap gap-3">
              {/* Sort Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-sm font-medium text-gray-700">
                    Sort: {sortBy === "recent" ? "Most Recent" : "Oldest"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
                <div className="absolute left-0 mt-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <button
                    onClick={() => setSortBy("recent")}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm font-medium text-gray-700 border-b border-gray-100"
                  >
                    Most Recent
                  </button>
                  <button
                    onClick={() => setSortBy("oldest")}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm font-medium text-gray-700"
                  >
                    Oldest First
                  </button>
                </div>
              </div>

              {/* Category Filter */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors">
                  <span className="text-sm font-medium text-gray-700">
                    Category:{" "}
                    {selectedFilter === "all" ? "All" : selectedFilter}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
                <div className="absolute left-0 mt-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {[
                    "all",
                    "portrait",
                    "detail",
                    "venue",
                    "couple",
                    "group",
                  ].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm font-medium border-b border-gray-100 last:border-b-0 ${
                        selectedFilter === filter
                          ? "bg-pink-50 text-pink-600"
                          : "text-gray-700"
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-pink-100 text-pink-600"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-pink-100 text-pink-600"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Photo Grid/List */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
            {sortedPhotos.map((photo) => (
              <div
                key={photo.id}
                className={`
                  relative group overflow-hidden rounded-xl cursor-pointer
                  transition-all hover:scale-[1.02] hover:shadow-xl
                  bg-linear-to-br ${photo.color}
                  ${photo.size === "large" ? "md:row-span-2 md:col-span-1" : ""}
                  ${photo.size === "medium" ? "md:row-span-2" : ""}
                  ${photo.size === "wide" ? "md:col-span-2" : ""}
                `}
                onClick={() => setSelectedPhoto(photo.id)}
              >
                {/* Placeholder content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full bg-black/10 flex items-center justify-center">
                    <span className="text-white/40 text-4xl font-bold">
                      {photo.id}
                    </span>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all"></div>

                {/* Action buttons on hover */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(photo.id);
                    }}
                    className="p-3 bg-white rounded-full hover:bg-pink-50 transition-colors shadow-lg"
                    title="Like"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        likedPhotos.has(photo.id)
                          ? "fill-pink-600 text-pink-600"
                          : "text-gray-700"
                      }`}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(photo.id);
                    }}
                    className="p-3 bg-white rounded-full hover:bg-blue-50 transition-colors shadow-lg"
                    title="Share"
                  >
                    <Share2 className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(photo.id);
                    }}
                    className="p-3 bg-white rounded-full hover:bg-green-50 transition-colors shadow-lg"
                    title="Download"
                  >
                    <Download className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                {/* Photo info on hover */}
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-medium">
                    {photo.uploader}
                  </p>
                  <p className="text-white/70 text-xs">{photo.uploadedAt}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedPhotos.map((photo) => (
              <div
                key={photo.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                onClick={() => setSelectedPhoto(photo.id)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-16 h-16 rounded-lg bg-linear-to-br ${photo.color}`}
                  ></div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Photo #{photo.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      Uploaded by {photo.uploader} • {photo.uploadedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(photo.id);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        likedPhotos.has(photo.id)
                          ? "fill-pink-600 text-pink-600"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(photo.id);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(photo.id);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

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
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Photo Display */}
            <div className="relative h-96 bg-linear-to-br from-pink-100 to-rose-100 flex items-center justify-center">
              <span className="text-6xl font-bold text-white/20">
                {selectedPhoto}
              </span>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Photo Info */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Photo #{selectedPhoto}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Uploaded by Sarah • 2 hours ago
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleLike(selectedPhoto)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        likedPhotos.has(selectedPhoto)
                          ? "fill-pink-600 text-pink-600"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                  <span className="text-sm font-medium text-gray-600">
                    {likedPhotos.has(selectedPhoto) ? "1" : "0"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleShare(selectedPhoto)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button
                  onClick={() => handleDownload(selectedPhoto)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Upload Button */}
      <button
        onClick={handleUpload}
        className="fixed bottom-8 right-8 px-6 py-4 bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full font-semibold shadow-2xl hover:shadow-pink-500/50 transition-all flex items-center gap-2 hover:scale-105 z-10"
      >
        <Upload className="w-5 h-5" />
        Upload Photo
      </button>
    </div>
  );
};

export default Gallery;
