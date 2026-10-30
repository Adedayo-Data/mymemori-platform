import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRIVACY_CONTENT, TERMS_CONTENT, CONTACT_INFO } from "../data/legalContent";
import { ContactForm } from "./legal/ContactForm";

export type LegalTab = "privacy" | "terms" | "contact";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = "privacy"
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-[130] w-full max-w-2xl max-h-[88vh] rounded-3xl bg-[#121217]/95 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex flex-col overflow-hidden"
            style={{
              background:
                "radial-gradient(ellipse at top right, rgba(255, 79, 147, 0.12) 0%, rgba(192, 41, 155, 0.05) 50%, rgba(18, 18, 23, 0.98) 100%)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden glass-2-0 p-1 flex items-center justify-center bg-white/5 border border-white/10">
                  <img alt="Logo" className="w-full h-full object-contain mix-blend-screen" src="/logo.png" />
                </div>
                <div>
                  <h3 className="font-sora font-bold text-white text-base leading-tight">MyMemori Legal & Support</h3>
                  <p className="font-hanken text-[11px] text-white/40">Nightlife moments, protected & shared</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/60 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 px-6 pt-4 pb-2 border-b border-white/5 shrink-0 bg-white/[0.02]">
              {(
                [
                  { id: "privacy", label: "Privacy Policy" },
                  { id: "terms", label: "Terms of Service" },
                  { id: "contact", label: "Contact Us" }
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold font-hanken tracking-wide transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-[#ff4f93] to-[#c0299b] text-white shadow-[0_0_15px_rgba(255,79,147,0.35)]"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 text-white space-y-6 scrollbar-thin">
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold font-sora text-white">{PRIVACY_CONTENT.title}</h2>
                    <p className="text-xs text-white/50 font-hanken mt-1">{PRIVACY_CONTENT.subtitle}</p>
                    <p className="text-[11px] text-[#ffb0cd] font-mono mt-1">Last Updated: {PRIVACY_CONTENT.lastUpdated}</p>
                  </div>

                  <div className="space-y-5">
                    {PRIVACY_CONTENT.sections.map((sec) => (
                      <div key={sec.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                        <h4 className="font-sora font-semibold text-sm text-[#ffb0cd]">{sec.title}</h4>
                        {sec.content.map((paragraph, idx) => (
                          <p key={idx} className="font-hanken text-xs text-white/70 leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "terms" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold font-sora text-white">{TERMS_CONTENT.title}</h2>
                    <p className="text-xs text-white/50 font-hanken mt-1">{TERMS_CONTENT.subtitle}</p>
                    <p className="text-[11px] text-[#ffb0cd] font-mono mt-1">Last Updated: {TERMS_CONTENT.lastUpdated}</p>
                  </div>

                  <div className="space-y-5">
                    {TERMS_CONTENT.sections.map((sec) => (
                      <div key={sec.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                        <h4 className="font-sora font-semibold text-sm text-[#ffb0cd]">{sec.title}</h4>
                        {sec.content.map((paragraph, idx) => (
                          <p key={idx} className="font-hanken text-xs text-white/70 leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "contact" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold font-sora text-white">{CONTACT_INFO.title}</h2>
                    <p className="text-xs text-white/50 font-hanken mt-1">{CONTACT_INFO.subtitle}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                      <p className="text-[11px] font-semibold text-white/40 uppercase font-hanken">General & Support</p>
                      <a href={`mailto:${CONTACT_INFO.supportEmail}`} className="text-sm font-sora font-medium text-[#ffb0cd] hover:underline">
                        {CONTACT_INFO.supportEmail}
                      </a>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                      <p className="text-[11px] font-semibold text-white/40 uppercase font-hanken">Venues & Partnerships</p>
                      <a href={`mailto:${CONTACT_INFO.partnershipsEmail}`} className="text-sm font-sora font-medium text-[#ffb0cd] hover:underline">
                        {CONTACT_INFO.partnershipsEmail}
                      </a>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10">
                    <h4 className="font-sora font-semibold text-sm text-white mb-3">Send Us a Direct Message</h4>
                    <ContactForm onSuccess={onClose} />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-white/5 bg-white/[0.02] flex items-center justify-between text-[11px] text-white/40 font-hanken shrink-0">
              <span>&copy; {new Date().getFullYear()} MyMemori Platform</span>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LegalModal;
