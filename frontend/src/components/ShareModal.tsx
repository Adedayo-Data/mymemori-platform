import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import toast from "react-hot-toast";

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  eventSlug: string;
  eventLink?: string;
  onGenerateCard?: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  eventTitle,
  eventSlug,
  eventLink,
  onGenerateCard,
}) => {
  const visitUrl =
    eventLink || `${window.location.origin}/visit/${eventSlug || "event"}/`;

  const handleCopyLink = async () => {
    try {
      const shareText = `Join my memory album "${eventTitle || "Event"}" on MyMemori! ${visitUrl}`;
      await navigator.clipboard.writeText(shareText);
      toast.success("Invite message & link copied!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleShareSocial = (platform: "whatsapp" | "facebook" | "instagram") => {
    const text = `Join my memory album "${eventTitle || "Event"}" on MyMemori!`;
    if (platform === "whatsapp") {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(text + " " + visitUrl)}`,
        "_blank"
      );
    } else if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(visitUrl)}`,
        "_blank"
      );
    } else if (platform === "instagram") {
      handleCopyLink();
      toast.success("Link copied! Paste it in your Instagram story or bio.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-0 left-0 right-0 z-[110] bg-[#1a1921]/95 backdrop-blur-xl rounded-t-[2rem] p-6 border-t border-white/15 shadow-[0_-10px_40px_rgba(0,0,0,0.6)] md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md md:w-full md:rounded-3xl md:border"
          >
            {/* Handlebar for mobile */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-5 md:hidden" />

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffb0cd] text-[20px]">
                  auto_awesome
                </span>
                Share the Magic
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors text-[#debec8]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* 4 Social Actions */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {/* WhatsApp */}
              <button
                type="button"
                onClick={() => handleShareSocial("whatsapp")}
                className="flex flex-col items-center space-y-2 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#ffb0cd]/60 group-hover:bg-white/10 transition-all">
                  <span className="material-symbols-outlined text-[#ffb0cd] text-[24px]">
                    chat
                  </span>
                </div>
                <span className="text-xs text-[#debec8] group-hover:text-white transition-colors">
                  WhatsApp
                </span>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={() => handleShareSocial("facebook")}
                className="flex flex-col items-center space-y-2 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#ffb0cd]/60 group-hover:bg-white/10 transition-all">
                  <span className="material-symbols-outlined text-[#ffb0cd] text-[24px]">
                    facebook
                  </span>
                </div>
                <span className="text-xs text-[#debec8] group-hover:text-white transition-colors">
                  Facebook
                </span>
              </button>

              {/* Instagram */}
              <button
                type="button"
                onClick={() => handleShareSocial("instagram")}
                className="flex flex-col items-center space-y-2 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#ffb0cd]/60 group-hover:bg-white/10 transition-all">
                  <span className="material-symbols-outlined text-[#ffb0cd] text-[24px]">
                    camera
                  </span>
                </div>
                <span className="text-xs text-[#debec8] group-hover:text-white transition-colors">
                  Instagram
                </span>
              </button>

              {/* Copy Link */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex flex-col items-center space-y-2 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#ffb0cd]/60 group-hover:bg-white/10 transition-all">
                  <span className="material-symbols-outlined text-[#ffb0cd] text-[24px]">
                    link
                  </span>
                </div>
                <span className="text-xs text-[#debec8] group-hover:text-white transition-colors">
                  Copy Link
                </span>
              </button>
            </div>

            {/* Download Story Card Promo Card */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-2">
              <div className="flex items-center space-x-4">
                <div className="w-16 aspect-[4/5] rounded-xl bg-[#0e0e13] overflow-hidden relative shrink-0 flex items-center justify-center border border-white/10 p-2">
                  <div className="w-9 h-9 bg-white rounded-md p-0.5 flex items-center justify-center shadow">
                    <QRCodeSVG value={visitUrl} size={32} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm text-white font-semibold mb-0.5">
                    Download Story Card
                  </h4>
                  <p className="text-xs text-[#debec8]/80 mb-3">
                    Create a beautiful 9:16 card to share on your story or print for tables.
                  </p>
                  {onGenerateCard && (
                    <button
                      type="button"
                      onClick={onGenerateCard}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#f751a1]/25 to-[#6f00be]/25 hover:from-[#f751a1]/40 hover:to-[#6f00be]/40 text-[#ffb0cd] font-semibold text-xs border border-[#ffb0cd]/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                      <span>Generate Share Card</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
