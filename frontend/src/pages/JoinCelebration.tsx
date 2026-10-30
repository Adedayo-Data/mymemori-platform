import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import HomeTopNav from "../components/HomeTopNav";
import HomeBottomNav from "../components/HomeBottomNav";
import toast from "react-hot-toast";

const JoinCelebration: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pin, setPin] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const PIN_LENGTH = 6;

  // Auto-focus the input on mount so native keyboard is ready
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle hardware keyboard Enter key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && pin.trim().length > 0) {
        handleEnterCelebration();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        toast.error("Clipboard is empty");
        return;
      }
      // If clipboard contains a visit URL like https://.../visit/slug, extract slug
      const urlMatch = text.match(/\/visit\/([a-zA-Z0-9_-]+)/);
      const cleanCode = urlMatch
        ? urlMatch[1]
        : text.trim().replace(/[^a-zA-Z0-9]/g, "");
      if (cleanCode) {
        const truncated = cleanCode.slice(0, PIN_LENGTH).toUpperCase();
        setPin(truncated);
        toast.success(`Pasted: ${truncated}`);
      } else {
        toast.error("No valid code found in clipboard");
      }
    } catch {
      toast.error("Could not read from clipboard");
    }
  };

  const handleEnterCelebration = () => {
    const code = pin.trim();
    if (!code) {
      toast.error("Please enter a celebration code");
      return;
    }
    navigate(`/visit/${code.toLowerCase()}`);
  };

  // QR scanner file input fallback
  const handleQRScanClick = () => {
    const qrInput = document.getElementById("qr-file-input") as HTMLInputElement;
    if (qrInput) {
      qrInput.click();
    }
  };

  const handleQRFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.loading("Scanning QR code image...", { duration: 1500 });
      setTimeout(() => {
        toast.success("Image received. Or type the 6-character code.");
      }, 1600);
    }
  };

  return (
    <div className="bg-[#131318] text-[#e4e1e9] min-h-screen flex flex-col font-sans select-none relative overflow-x-hidden selection:bg-[#ffb0cd]/30">
      <input
        id="qr-file-input"
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleQRFileChange}
      />

      {/* Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#ffb0cd]/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#ddb7ff]/10 blur-[120px]" />
      </div>

      {/* Standard App Top Navigation Bar */}
      <div className="hidden md:flex">
        <HomeTopNav
        mainTab="events"
        onTabChange={(tab) => {
          if (tab === "home") navigate("/home");
          else if (tab === "pictures") navigate("/event-list");
        }}
        onOpenProfile={() => navigate("/profile")}
        user={user}
      />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center w-full pt-24 pb-28 px-4 sm:px-6 max-w-md mx-auto relative z-10 my-auto">
        {/* Ethereal Ambient Glow Orbs */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-br from-[#ffb0cd]/15 via-[#6f00be]/20 to-transparent blur-3xl pointer-events-none rounded-full" />

        {/* Header & Context Area */}
        <div className="relative z-10 flex flex-col items-center text-center mb-6 px-1">
          {/* Live Event Access Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-sm mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffb0cd] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffb0cd]" />
            </span>
            <span className="text-xs text-[#ffb0cd] tracking-wider uppercase font-semibold">
              LIVE EVENT ACCESS
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl text-white tracking-tight font-bold mb-2">
            Enter Celebration Code
          </h2>
          <p className="text-sm text-[#debec8] max-w-xs leading-relaxed">
            Type in the 6-character event PIN or invitation token shared by the host to unlock the live photo stream.
          </p>
        </div>

        {/* Interactive 6-Slot PIN Input Section (Opens native keyboard) */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="relative z-10 flex flex-col items-center w-full mb-6 cursor-pointer"
        >
          {/* Transparent Input overlaid across the slots for direct typing on phone/desktop */}
          <input
            ref={inputRef}
            type="text"
            inputMode="text"
            autoCapitalize="characters"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            maxLength={PIN_LENGTH}
            className="opacity-0 absolute inset-0 w-full h-14 cursor-pointer z-20"
            value={pin}
            onChange={(e) =>
              setPin(e.target.value.toUpperCase().slice(0, PIN_LENGTH))
            }
          />

          <div className="grid grid-cols-6 gap-2 w-full max-w-sm px-1 mb-3 relative z-10">
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const char = pin[idx] || "";
              const isActive = idx === pin.length;
              return (
                <div
                  key={idx}
                  className={`relative flex flex-col items-center justify-center h-14 rounded-xl backdrop-blur-md transition-all duration-200 border ${
                    isActive
                      ? "bg-[#35343a]/90 border-[#ffb0cd] shadow-lg ring-2 ring-[#ffb0cd]/60 shadow-[#ffb0cd]/20"
                      : char
                      ? "bg-[#2a292f]/90 border-white/15 shadow-md"
                      : "bg-[#1f1f25]/80 border-white/10 shadow-sm"
                  }`}
                >
                  <span
                    className={`text-xl font-bold ${
                      isActive
                        ? "text-[#ffb0cd]"
                        : char
                        ? "text-white"
                        : "text-white/20"
                    }`}
                  >
                    {char || "•"}
                  </span>
                  {isActive ? (
                    <div className="absolute bottom-1.5 w-6 h-0.5 rounded-full bg-[#ffb0cd] animate-pulse" />
                  ) : char ? (
                    <div className="absolute bottom-1.5 w-5 h-0.5 rounded-full bg-[#ffb0cd]/40" />
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Quick Paste Pill Helper */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePaste();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 active:scale-95 transition-all text-[#debec8] hover:text-[#ffb0cd] shadow-sm cursor-pointer text-xs"
          >
            <span className="material-symbols-outlined text-[16px] text-[#ffb0cd]">
              content_paste
            </span>
            <span>Paste from clipboard</span>
          </button>
        </div>

        {/* Primary Action Buttons */}
        <div className="relative z-10 flex flex-col gap-3 w-full mb-6">
          {/* Main Enter Celebration Button */}
          <button
            type="button"
            onClick={handleEnterCelebration}
            className="group relative flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#f751a1] via-[#ff516a] to-[#6f00be] text-white text-base font-semibold shadow-xl shadow-[#f751a1]/25 hover:shadow-[#f751a1]/40 active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <span className="tracking-wide">Enter Celebration</span>
            <span className="material-symbols-outlined text-[22px] transition-transform duration-200 group-hover:translate-x-1">
              auto_awesome
            </span>
          </button>

          {/* Scan QR Code Secondary Button */}
          <button
            type="button"
            onClick={handleQRScanClick}
            className="flex items-center justify-center gap-2.5 w-full py-3.5 px-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 active:scale-95 transition-all text-white text-sm font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] text-[#ffb0cd]">
              qr_code_scanner
            </span>
            <span>Scan Event QR Code Instead</span>
          </button>
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <HomeBottomNav
        mainTab="events"
        onTabChange={(tab) => {
          if (tab === "home") navigate("/home");
          else if (tab === "pictures") navigate("/event-list");
        }}
        onOpenProfile={() => navigate("/profile")}
        onCreateClick={() => navigate("/book")}
      />
    </div>
  );
};

export default JoinCelebration;
