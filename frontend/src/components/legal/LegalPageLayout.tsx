import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { type LegalTab } from "../LegalModal";

interface LegalPageLayoutProps {
  currentTab: LegalTab;
  title: string;
  subtitle: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
  currentTab,
  title,
  subtitle,
  lastUpdated,
  children
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09090d] text-white font-hanken selection:bg-[#ff4f93]/30 overflow-x-hidden flex flex-col relative">
      {/* Background Ambience / Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#ff4f93]/15 via-[#c0299b]/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#c0299b]/5 blur-[100px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#09090d]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>&larr;</span>
              <span>Back</span>
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg overflow-hidden glass-2-0 p-1 flex items-center justify-center bg-white/5 border border-white/10 group-hover:border-[#ff4f93]/40 transition-all">
                <img alt="Logo" className="w-full h-full object-contain mix-blend-screen" src="/logo.png" />
              </div>
              <span className="text-[17px] font-bold tracking-[-0.02em] text-white/80 group-hover:text-white transition-colors font-sora">
                MyMemori
              </span>
            </Link>
          </div>

          {/* Quick tab switcher */}
          <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
            <Link
              to="/privacy"
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                currentTab === "privacy"
                  ? "bg-gradient-to-r from-[#ff4f93] to-[#c0299b] text-white shadow-[0_0_12px_rgba(255,79,147,0.4)]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                currentTab === "terms"
                  ? "bg-gradient-to-r from-[#ff4f93] to-[#c0299b] text-white shadow-[0_0_12px_rgba(255,79,147,0.4)]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              Terms
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                currentTab === "contact"
                  ? "bg-gradient-to-r from-[#ff4f93] to-[#c0299b] text-white shadow-[0_0_12px_rgba(255,79,147,0.4)]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-[#ffb0cd] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4f93] animate-pulse" />
            <span>MyMemori Legal & Community</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-sora tracking-tight text-white mb-3">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-white/55 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
          {lastUpdated && (
            <p className="text-xs text-[#ff4f93] font-mono mt-3">
              Last Updated: {lastUpdated}
            </p>
          )}
        </div>

        {/* Content Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-8 mt-auto relative z-10 bg-[#09090d]/60">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} MyMemori Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
