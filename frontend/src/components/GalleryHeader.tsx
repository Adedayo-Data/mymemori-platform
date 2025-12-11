import { Download } from "lucide-react";

interface GalleryHeaderProps {
  eventTitle: string;
  eventDate: string;
  photoCount: number;
  onDownloadAll: () => void;
}

const GalleryHeader = ({
  eventTitle,
  eventDate,
  photoCount,
  onDownloadAll,
}: GalleryHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
            {eventTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {photoCount} photos • {eventDate}
          </p>
        </div>
      </div>

      {/* Commented out Download All button */}
      {/* <button
        onClick={onDownloadAll}
        className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors font-medium text-sm flex-shrink-0"
      >
        <Download className="w-4 h-4" />
        <span>Download All</span>
      </button> */}

      {/* Mobile Download Icon Only - Commented out */}
      {/* <button
        onClick={onDownloadAll}
        className="sm:hidden p-2 text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors flex-shrink-0"
      >
        <Download className="w-5 h-5" />
      </button> */}
    </div>
  );
};

export default GalleryHeader;
