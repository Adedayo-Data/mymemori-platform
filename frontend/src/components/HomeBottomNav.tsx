import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface HomeBottomNavProps {
  mainTab?: "home" | "events" | "pictures" | "profile";
  onTabChange: (tab: "home" | "events" | "pictures") => void;
  onOpenProfile?: () => void;
  onCreateClick?: () => void;
}

const HomeBottomNav: React.FC<HomeBottomNavProps> = ({
  mainTab = "home",
  onTabChange,
  onOpenProfile,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isJoinActive = location.pathname === "/join";

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-white/5 backdrop-blur-md border-t border-white/10 shadow-lg rounded-t-xl no-shadow">
      {/* Home Button */}
      <button
        type="button"
        onClick={() => {
          if (location.pathname !== "/home") {
            navigate("/home");
          }
          onTabChange("home");
        }}
        className={`flex flex-col items-center justify-center rounded-full px-5 py-1.5 scale-95 active:scale-90 transition-all duration-200 cursor-pointer ${
          mainTab === "home" && !isJoinActive
            ? "bg-secondary/20 text-secondary"
            : "text-on-surface-variant/70 hover:bg-white/5"
        }`}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontVariationSettings:
              mainTab === "home" && !isJoinActive ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          home
        </span>
        <span className="font-label-md text-label-md mt-1 text-[10px]">Home</span>
      </button>

      {/* Events Button (links to join an event) */}
      <button
        type="button"
        onClick={() => navigate("/join")}
        className={`flex flex-col items-center justify-center rounded-full px-5 py-1.5 scale-95 active:scale-90 transition-all duration-200 cursor-pointer ${
          isJoinActive
            ? "bg-secondary/20 text-secondary"
            : "text-on-surface-variant/70 hover:bg-white/5"
        }`}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontVariationSettings: isJoinActive ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          event
        </span>
        <span className="font-label-md text-label-md mt-1 text-[10px]">Events</span>
      </button>

      {/* Memories Button */}
      <button
        type="button"
        onClick={() => navigate("/event-list")}
        className={`flex flex-col items-center justify-center rounded-full px-5 py-1.5 scale-95 active:scale-90 transition-all duration-200 cursor-pointer ${
          location.pathname === "/event-list"
            ? "bg-secondary/20 text-secondary"
            : "text-on-surface-variant/70 hover:bg-white/5"
        }`}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontVariationSettings:
              location.pathname === "/event-list" ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          auto_stories
        </span>
        <span className="font-label-md text-label-md mt-1 text-[10px]">Memories</span>
      </button>

      {/* Profile Button */}
      <button
        type="button"
        onClick={() => {
          if (onOpenProfile) onOpenProfile();
          navigate("/profile");
        }}
        className={`flex flex-col items-center justify-center rounded-full px-5 py-1.5 scale-95 active:scale-90 transition-all duration-200 cursor-pointer ${
          location.pathname === "/profile" || mainTab === "profile"
            ? "bg-secondary/20 text-secondary"
            : "text-on-surface-variant/70 hover:bg-white/5"
        }`}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontVariationSettings:
              location.pathname === "/profile" || mainTab === "profile" ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          person
        </span>
        <span className="font-label-md text-label-md mt-1 text-[10px]">Profile</span>
      </button>
    </nav>
  );
};

export default HomeBottomNav;
