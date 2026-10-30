import React, { useState } from "react";
import ConfirmModal from "./ConfirmModal";

export interface PhotoItem {
  photoId: string;
  imageUrl: string;
  uploader: string;
  uploadedAt: string;
  type?: string;
  size?: string;
  color?: string;
}

export interface BentoPictureCardProps {
  picture: PhotoItem;
  onDelete?: (id: string) => void;
}

const BentoPictureCard: React.FC<BentoPictureCardProps> = ({ picture, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(picture.imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `photo-${picture.photoId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
      window.open(picture.imageUrl, "_blank");
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDelete || isDeleting) return;
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(picture.photoId);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <article className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden relative group cursor-pointer hover:border-white/25 transition-all duration-300">
        <div className="relative aspect-square">
          <img
            src={picture.imageUrl}
            alt={`Uploaded by ${picture.uploader || "user"}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Action Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-center gap-2 sm:gap-3 z-10 opacity-90 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleDownload}
              title="Download photo"
              className="w-8 h-8 sm:w-10 sm:h-10 bg-[#1e1d24]/90 hover:bg-[#2c2b36] backdrop-blur-md rounded-full text-white border border-white/15 shadow-lg flex items-center justify-center active:scale-90 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] sm:text-[20px]">download</span>
            </button>
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting}
                title="Delete photo"
                className="w-8 h-8 sm:w-10 sm:h-10 bg-[#1e1d24]/90 hover:bg-red-500/25 backdrop-blur-md rounded-full text-white hover:text-[#ffb4ab] border border-white/15 hover:border-red-500/30 shadow-lg flex items-center justify-center active:scale-90 transition-all cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px] sm:text-[20px]">delete</span>
              </button>
            )}
          </div>
        </div>
      </article>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Picture"
        description="Are you sure you want to delete this picture? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </>
  );
};

export default BentoPictureCard;
