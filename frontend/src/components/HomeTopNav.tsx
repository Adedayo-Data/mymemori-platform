import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface HomeTopNavProps {
  mainTab: "home" | "events" | "pictures";
  onTabChange: (tab: "home" | "events" | "pictures") => void;
  onOpenProfile: () => void;
  user: any;
}

const HomeTopNav: React.FC<HomeTopNavProps> = ({
  mainTab,
  onTabChange,
  onOpenProfile,
  user,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="flex justify-between items-center px-4 sm:px-6 md:px-8 h-16 w-full fixed top-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10 no-shadow">
      <div className="flex items-center gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl overflow-hidden glass-2-0 p-1 flex items-center justify-center">
            <img alt="MyMemori" className="w-full h-full object-contain mix-blend-screen" src="/logo.png" />
          </div>
          <h1
            onClick={() => navigate("/home")}
            className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight cursor-pointer"
          >
            MyMemori
          </h1>
        </div>

        {/* Desktop Navigation Cluster */}
        <nav className="hidden md:flex items-center gap-2 ml-6">
          <button
            type="button"
            onClick={() => {
              if (location.pathname !== "/home") {
                navigate("/home");
              }
              onTabChange("home");
            }}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 transition-all duration-200 cursor-pointer ${
              location.pathname === "/home" && (mainTab === "home" || mainTab === "events")
                ? "bg-secondary/20 text-secondary"
                : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface"
            }`}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{
                fontVariationSettings:
                  location.pathname === "/home" && (mainTab === "home" || mainTab === "events")
                    ? "'FILL' 1"
                    : "'FILL' 0",
              }}
            >
              event
            </span>
            <span className="font-label-md text-label-md">Events</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/event-list")}
            className={`flex items-center gap-2 rounded-full px-4 py-1.5 transition-all duration-200 cursor-pointer ${
              location.pathname === "/event-list"
                ? "bg-secondary/20 text-secondary"
                : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface"
            }`}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{
                fontVariationSettings:
                  location.pathname === "/event-list" ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              auto_stories
            </span>
            <span className="font-label-md text-label-md">Memories</span>
          </button>
        </nav>
      </div>

      {/* User Avatar & Menu */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/join")}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-secondary hover:text-white transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
          <span>Join Event</span>
        </button>

        <button
          onClick={() => {
            if (onOpenProfile) onOpenProfile();
            navigate("/profile");
          }}
          title="Open Profile"
          className="hidden md:flex h-8 w-8 rounded-full overflow-hidden bg-surface-container-high border border-white/20 shadow-inner flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all text-xs font-semibold text-primary"
        >
          {user?.fullName ? (
            user.fullName.charAt(0).toUpperCase()
          ) : (
            <span className="material-symbols-outlined text-sm">person</span>
          )}
        </button>
      </div>
    </header>
  );
};

export default HomeTopNav;
