import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isDestructive?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete this Memory?",
  description = "This action cannot be undone. Are you sure you want to permanently remove this memory from your collection?",
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Scrim / Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-[100]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-[110] w-full max-w-sm overflow-hidden rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl flex flex-col items-center p-6 text-center"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255, 180, 171, 0.12) 0%, rgba(255, 180, 171, 0) 70%), rgba(255, 255, 255, 0.05)",
            }}
          >
            {/* Warning Icon with Glow */}
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#93000a]/30 text-[#ffb4ab] mb-4 shadow-[0_0_20px_rgba(255,180,171,0.25)] border border-[#ffb4ab]/20">
              <span
                className="material-symbols-outlined text-[32px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                warning
              </span>
            </div>

            {/* Text Content */}
            <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
              {title}
            </h2>
            <div className="text-sm text-[#debec8] text-center mb-6 leading-relaxed">
              {description}
            </div>

            {/* Actions */}
            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 py-3 px-4 rounded-full bg-white/10 border border-white/20 text-sm font-semibold text-white hover:bg-white/20 active:scale-95 transition-all duration-200 shadow-sm backdrop-blur-md cursor-pointer disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-[#ffb4ab] via-[#ff516a] to-[#93000a] text-white font-semibold text-sm hover:opacity-90 active:scale-95 transition-all duration-200 shadow-lg shadow-[#93000a]/40 cursor-pointer disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
