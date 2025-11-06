import { Download, Heart, Share2 } from "lucide-react";

export interface Photo {
  id: number;
  type: string;
  size: string;
  color: string;
  uploader: string;
  uploadedAt: string;
}

interface PhotoGridProps {
  photos: Photo[];
  viewMode: "grid" | "list";
  likedPhotos: Set<number>;
  onPhotoClick: (photoId: number) => void;
  onLike: (photoId: number) => void;
  onShare: (photoId: number) => void;
  onDownload: (photoId: number) => void;
}

const PhotoGrid = ({
  photos,
  viewMode,
  likedPhotos,
  onPhotoClick,
  onLike,
  onShare,
  onDownload,
}: PhotoGridProps) => {
  if (viewMode === "grid") {
    return (
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
            onClick={() => onPhotoClick(photo.id)}
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
                  onLike(photo.id);
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
                  onShare(photo.id);
                }}
                className="p-3 bg-white rounded-full hover:bg-blue-50 transition-colors shadow-lg"
                title="Share"
              >
                <Share2 className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(photo.id);
                }}
                className="p-3 bg-white rounded-full hover:bg-green-50 transition-colors shadow-lg"
                title="Download"
              >
                <Download className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Photo info on hover */}
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs font-medium">{photo.uploader}</p>
              <p className="text-white/70 text-xs">{photo.uploadedAt}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-3">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
          onClick={() => onPhotoClick(photo.id)}
        >
          <div className="flex items-center gap-4 flex-1">
            <div
              className={`w-16 h-16 rounded-lg bg-linear-to-br ${photo.color}`}
            ></div>
            <div>
              <p className="font-medium text-gray-900">Photo #{photo.id}</p>
              <p className="text-sm text-gray-600">
                Uploaded by {photo.uploader} • {photo.uploadedAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike(photo.id);
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
                onShare(photo.id);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Share2 className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload(photo.id);
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

export default PhotoGrid;
