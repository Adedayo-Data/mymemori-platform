import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface JoinEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JoinEventModal: React.FC<JoinEventModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");

  const handleJoinEvent = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = joinCode.trim();
    if (!code) {
      setJoinError("Please enter an event code or slug");
      return;
    }
    onClose();
    navigate(`/visit/${code}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={() => {
            onClose();
            setJoinError("");
          }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md p-6 rounded-2xl bg-surface-container-high/95 backdrop-blur-2xl border border-white/15 shadow-2xl flex flex-col gap-4 text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">qr_code_scanner</span>
                <span className="font-title-md text-lg font-bold text-on-surface">Join Event</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  setJoinError("");
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-on-surface-variant hover:text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <p className="font-body-md text-on-surface-variant text-sm">
              Enter the room code printed on your event invite or scan the host table QR.
            </p>

            <form onSubmit={handleJoinEvent} className="flex flex-col gap-3">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => {
                  setJoinCode(e.target.value);
                  setJoinError("");
                }}
                placeholder="e.g. MEM-842 or slug"
                className="w-full h-12 rounded-xl bg-surface-container-lowest border border-white/10 px-4 text-center font-title-md text-lg tracking-widest text-primary uppercase focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-on-surface-variant/40"
                autoFocus
              />
              {joinError && <p className="text-xs text-error text-center">{joinError}</p>}
              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-primary-container via-primary to-secondary text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform cursor-pointer"
              >
                <span>Connect to Stream</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default JoinEventModal;
