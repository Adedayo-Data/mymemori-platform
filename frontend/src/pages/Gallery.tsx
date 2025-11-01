import { useState } from "react";
import {
  Upload,
  Download,
  ChevronDown,
  Grid3x3,
  List,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Gallery = () => {
  const [viewMode, setViewMode] = useState("grid");
  const navigate = useNavigate();
  //   const [selectedFilter, setSelectedFilter] = useState("all");

  const photos = [
    {
      id: 1,
      type: "portrait",
      size: "large",
      color: "from-pink-100 to-rose-100",
    },
    {
      id: 2,
      type: "detail",
      size: "small",
      color: "from-amber-50 to-orange-50",
    },
    {
      id: 3,
      type: "venue",
      size: "small",
      color: "from-amber-800 to-orange-900",
    },
    {
      id: 4,
      type: "detail",
      size: "small",
      color: "from-slate-700 to-slate-900",
    },
    {
      id: 5,
      type: "bride",
      size: "small",
      color: "from-emerald-700 to-teal-800",
    },
    {
      id: 6,
      type: "decor",
      size: "medium",
      color: "from-rose-100 to-pink-100",
    },
    {
      id: 7,
      type: "couple",
      size: "medium",
      color: "from-red-900 to-rose-950",
    },
    {
      id: 8,
      type: "venue",
      size: "small",
      color: "from-amber-600 to-orange-700",
    },
    {
      id: 9,
      type: "couple",
      size: "small",
      color: "from-slate-100 to-gray-200",
    },
    {
      id: 10,
      type: "detail",
      size: "small",
      color: "from-emerald-50 to-teal-50",
    },
    { id: 11, type: "group", size: "small", color: "from-blue-50 to-sky-100" },
    {
      id: 12,
      type: "celebration",
      size: "wide",
      color: "from-amber-900 to-orange-950",
    },
  ];

  const handleUpload = () => {
    console.log("Upload photo clicked");
    alert("Opening photo upload...");
  };

  //   const handleDownload = () => {
  //     console.log("Download all photos");
  //     alert("Downloading all photos...");
  //   };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => navigate("/visit")}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Eleanor & James' Wedding
                </h1>
                <p className="text-sm text-gray-500">
                  December 14, 2024.100 photos
                </p>
              </div>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 border hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Download All</span>
            </button>
          </div>

          {/* Filters and View Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <span className="text-sm font-medium text-gray-700">
                  Sort by: Most Recent
                </span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <span className="text-sm font-medium text-gray-700">
                  By Moment (All)
                </span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <span className="text-sm font-medium text-gray-700">
                  All Photos
                </span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                <Grid3x3 className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-gray-200" : "hover:bg-gray-100"
                }`}
              >
                <List className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Photo Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {photos.map((photo) => (
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
            >
              {/* Placeholder content to simulate photos */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full bg-black/10 flex items-center justify-center">
                  <span className="text-white/40 text-4xl font-bold">
                    {photo.id}
                  </span>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all"></div>

              {/* Download icon on hover */}
              <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white">
                <Download className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Load More
          </button>
        </div>
      </div>

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
