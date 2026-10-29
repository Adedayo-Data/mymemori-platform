import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadClick: () => void;
  photoCount?: number;
}

const UploadUnlockModal: React.FC<UploadUnlockModalProps> = ({
  isOpen,
  onClose,
  onUploadClick,
  photoCount,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0a0a0f]/80 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-[32px] p-7 sm:p-9 flex flex-col items-center text-center relative overflow-hidden z-10 bg-[#191920]/95 border border-white/15 backdrop-blur-2xl shadow-2xl"
            style={{
              boxShadow:
                "0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 0 0 1px rgba(255, 255, 255, 0.08)",
            }}
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#ffb0cd]/20 blur-[70px] rounded-full pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-[#debec8] hover:text-white flex items-center justify-center transition-colors cursor-pointer z-20"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {/* Glowing Icon Badge */}
            <div className="relative w-20 h-20 mb-5 flex items-center justify-center z-10">
              <div className="absolute inset-0 rounded-full bg-[#ffb0cd]/25 blur-xl animate-pulse" />
              <div className="relative w-full h-full rounded-full border border-[#ffb0cd]/30 flex items-center justify-center bg-white/5 backdrop-blur-sm shadow-inner">
                <span
                  className="material-symbols-outlined text-[40px] text-[#ffb0cd]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  photo_camera
                </span>

                {/* Mini Lock Badge */}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#131318] border border-white/20 flex items-center justify-center shadow-md">
                  <span
                    className="material-symbols-outlined text-[15px] text-[#ffb0cd]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    lock
                  </span>
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="font-headline-lg-mobile text-2xl sm:text-3xl font-bold text-white mb-2 z-10 tracking-tight">
              Unlock the Memories
            </h2>

            {/* Description */}
            <p className="font-body-md text-sm sm:text-base text-[#debec8] mb-6 z-10 leading-relaxed max-w-xs">
              Contribute to the event! Upload just 1 photo to unlock and browse all memories
              {photoCount ? ` in this gallery (${photoCount}+ photos)` : ""}.
            </p>

            {/* Value Proposition List */}
            <div className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-3.5 mb-6 z-10 text-left space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#e4e1e9]">
                <div className="w-5 h-5 rounded-full bg-[#ffb0cd]/15 flex items-center justify-center text-[#ffb0cd] shrink-0">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </div>
                <span>View every guest photo and reaction</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#e4e1e9]">
                <div className="w-5 h-5 rounded-full bg-[#ffb0cd]/15 flex items-center justify-center text-[#ffb0cd] shrink-0">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </div>
                <span>Download and share in original high resolution</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#e4e1e9]">
                <div className="w-5 h-5 rounded-full bg-[#ffb0cd]/15 flex items-center justify-center text-[#ffb0cd] shrink-0">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </div>
                <span>Add your own angle to the live story</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-3 z-10">
              <button
                type="button"
                onClick={onUploadClick}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-primary to-secondary text-[#40000d] font-label-md text-sm sm:text-base font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(247,81,161,0.35)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
                <span>Upload a Photo</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-[#debec8]/70 hover:text-white font-label-md transition-colors text-xs sm:text-sm cursor-pointer"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UploadUnlockModal;
