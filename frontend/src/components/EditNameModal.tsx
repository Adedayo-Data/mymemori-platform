import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";

interface EditNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newName: string) => void;
  initialName: string;
  title?: string;
  isLoading?: boolean;
}

const EditNameModal: React.FC<EditNameModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialName,
  title = "Edit Event Title",
  isLoading = false,
}) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
    }
  }, [isOpen, initialName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && name !== initialName) {
      onSave(name.trim());
    } else if (name === initialName) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
          {/* Modal Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-xl z-[100]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full md:w-[480px] bg-[#1a1921]/95 md:bg-white/10 backdrop-blur-2xl border-t border-white/25 md:border border-white/20 rounded-t-3xl md:rounded-3xl shadow-2xl p-6 pb-10 md:pb-6 pb-safe z-[110] relative overflow-hidden"
          >
            {/* Subtle inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#ffb0cd]/20 blur-3xl rounded-full pointer-events-none" />

            {/* Mobile Handle */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 md:hidden" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#debec8] hover:bg-white/10 hover:text-[#ffb0cd] transition-colors active:scale-90 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="relative z-10">
              {/* Input Area */}
              <div className="mb-6 relative group">
                <label
                  htmlFor="event-title"
                  className="text-sm font-semibold text-[#debec8] block mb-2"
                >
                  Event Name
                </label>
                <div className="relative">
                  <input
                    id="event-title"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter event name"
                    autoFocus
                    disabled={isLoading}
                    className="w-full bg-white/5 border-0 border-b border-white/20 rounded-t-lg px-4 py-3 text-lg font-semibold text-white focus:ring-0 focus:border-[#ffb0cd] focus:bg-white/10 transition-colors placeholder-[#debec8]/40 outline-none"
                  />
                  {/* Focus indicator line */}
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#ffb0cd] transition-all duration-300 group-focus-within:w-full" />
                </div>
                <p className="text-xs text-[#debec8]/60 mt-2">
                  This title will be visible to all attendees.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="w-full md:w-auto px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-sm font-semibold text-white hover:bg-white/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !name.trim()}
                  className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#f751a1] to-[#6f00be] text-white font-semibold text-sm shadow-lg hover:opacity-95 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditNameModal;
