import React from "react";
import { motion } from "framer-motion";

interface UploadUnlockOverlayProps {
  photoCount?: number;
  onUploadClick: () => void;
  onDismiss?: () => void;
}

const UploadUnlockOverlay: React.FC<UploadUnlockOverlayProps> = ({
  photoCount,
  onUploadClick,
  onDismiss,
}) => {
  return (
    <div className="relative my-8">
      {/* Blurred phantom photos grid - creates illusion of locked gallery content */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 filter blur-[14px] opacity-35 select-none pointer-events-none">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[3/4] bg-gradient-to-br from-[#f751a1]/25 via-[#6f00be]/20 to-[#1f1f25] rounded-xl border border-white/5"
          />
        ))}
      </div>

      {/* FOMO Lock Overlay */}
      <div className="absolute inset-0 z-30 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="bg-white/10 backdrop-blur-2xl p-7 sm:p-8 rounded-3xl max-w-sm w-full text-center border border-white/20 shadow-2xl relative overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#ffb0cd]/20 rounded-full blur-[64px] pointer-events-none" />

          {/* Lock Icon */}
          <span
            className="material-symbols-outlined text-5xl text-[#ffb0cd] mb-3 block mx-auto"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            lock
          </span>

          {/* Title */}
          <h2 className="font-title-md text-xl sm:text-2xl font-bold text-white mb-2">
            Unlock the Memories
          </h2>

          {/* Description */}
          <p className="font-body-md text-sm text-[#debec8] mb-6 leading-relaxed">
            Contribute to the vibe! Upload just 1 photo to view the full gallery
            {photoCount ? ` of ${photoCount} photos` : ""}.
          </p>

          {/* Upload Button */}
          <button
            type="button"
            onClick={onUploadClick}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-primary to-secondary text-[#40000d] font-label-md text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(247,81,161,0.4)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_a_photo</span>
            <span>Upload a Photo</span>
          </button>

          {/* Maybe later button */}
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="mt-4 text-[#debec8] hover:text-white font-label-md transition-colors text-xs underline decoration-white/30 cursor-pointer block mx-auto"
            >
              Maybe later
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UploadUnlockOverlay;
