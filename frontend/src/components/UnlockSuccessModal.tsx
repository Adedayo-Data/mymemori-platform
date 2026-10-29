import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UnlockSuccessModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const UnlockSuccessModal: React.FC<UnlockSuccessModalProps> = ({
  isVisible,
  onClose,
}) => {
  // Auto-dismiss after 3 seconds if not dismissed by user
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[130] flex items-end md:items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0a0a0f]/75 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-[32px] p-8 pb-10 md:p-10 flex flex-col items-center text-center relative overflow-hidden z-10 bg-white/5 border border-white/20 backdrop-blur-2xl shadow-2xl"
            style={{
              boxShadow:
                "0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.08)",
            }}
          >
            {/* Ambient Glow behind modal content */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 blur-[60px] rounded-full pointer-events-none" />

            {/* Success Icon */}
            <div className="relative w-24 h-24 mb-6 flex items-center justify-center z-10">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
              <div className="absolute inset-0 rounded-full border border-emerald-500/30 flex items-center justify-center bg-white/5 backdrop-blur-sm shadow-inner">
                <span
                  className="material-symbols-outlined text-[64px] text-emerald-400"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
            </div>

            {/* Text Content */}
            <h2 className="font-headline-lg-mobile text-2xl sm:text-3xl font-bold text-white mb-2 z-10 tracking-tight">
              Magic Captured!
            </h2>
            <p className="font-body-md text-sm sm:text-base text-[#debec8] mb-8 z-10 max-w-[260px] leading-relaxed">
              You can now see all images in the gallery.
            </p>

            {/* Action Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-4 rounded-full font-label-md text-sm sm:text-base font-bold text-white bg-gradient-to-r from-[#f751a1] to-[#6f00be] shadow-lg shadow-[#f751a1]/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 z-10 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                photo_library
              </span>
              <span>View Gallery</span>
            </button>

            {/* Close indicator for mobile */}
            <div className="w-12 h-1 bg-white/20 rounded-full mt-6 z-10 md:hidden" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UnlockSuccessModal;
