import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCameraSelect: () => void;
  onGallerySelect: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onCameraSelect,
  onGallerySelect,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Ambient Glow */}
          <div className="fixed inset-x-0 bottom-0 h-1/2 pointer-events-none z-[121] overflow-hidden flex items-end justify-center">
            <div className="w-[120vw] h-[40vh] bg-gradient-to-t from-[#f751a1]/15 via-[#6f00be]/10 to-transparent blur-[60px] rounded-full translate-y-1/3" />
          </div>

          {/* Modal Container */}
          <motion.div
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="w-full max-w-md mx-auto z-[122] relative p-0 sm:p-4"
          >
            <div className="backdrop-blur-2xl bg-[#17171e]/95 border border-white/20 rounded-t-[32px] sm:rounded-[32px] p-6 pb-8 sm:p-8 shadow-2xl relative overflow-hidden">
              {/* Handle */}
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />

              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="font-headline-lg-mobile text-2xl sm:text-3xl font-bold text-[#ffb0cd] tracking-tight mb-1">
                  New Memory
                </h1>
                <p className="font-body-lg text-base text-[#debec8]">
                  Choose upload source
                </p>
              </div>

              {/* Source Options Grid */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                {/* Camera Button */}
                <button
                  type="button"
                  onClick={onCameraSelect}
                  className="relative group overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:bg-white/10 hover:border-[#ffb0cd]/40 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#ffb0cd]/50 aspect-square cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#f751a1]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span
                    className="material-symbols-outlined text-[48px] text-[#ffb0cd] mb-1 transition-transform group-hover:scale-110 duration-200"
                    style={{ fontVariationSettings: "'FILL' 0" }}
                  >
                    photo_camera
                  </span>
                  <span className="font-title-md text-base sm:text-lg font-semibold text-white">
                    Camera
                  </span>
                </button>

                {/* Library Button */}
                <button
                  type="button"
                  onClick={onGallerySelect}
                  className="relative group overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:bg-white/10 hover:border-[#ddb7ff]/40 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#ddb7ff]/50 aspect-square cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6f00be]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span
                    className="material-symbols-outlined text-[48px] text-[#ddb7ff] mb-1 transition-transform group-hover:scale-110 duration-200"
                    style={{ fontVariationSettings: "'FILL' 0" }}
                  >
                    photo_library
                  </span>
                  <span className="font-title-md text-base sm:text-lg font-semibold text-white">
                    Library
                  </span>
                </button>
              </div>

              {/* Cancel Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 font-title-md text-base font-semibold text-[#debec8] hover:text-white hover:bg-white/10 active:scale-95 transition-all duration-300 focus:outline-none cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UploadModal;
