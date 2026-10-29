import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEvent } from "../context/eventContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { retryWithBackoff } from "../utils/retryUtils";
import { getOrCreateSession } from "../utils/sessionUtils";
import { formatEventDate } from "../utils/dateUtils";
import { extractErrorMessage } from "../utils/errorUtils";

const Visit = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const [eventData, setEventData] = useState({
    eventName: "",
    eventDate: "",
    location: "",
    description: "",
    imageUrl: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    isPast: false,
  });

  const { getEventBySlug } = useEvent();

  // Fetch event data with retry
  const fetchWithRetry = async (eventSlug: string): Promise<void> => {
    try {
      const data = await retryWithBackoff(
        async () => await getEventBySlug(eventSlug),
        {
          maxRetries: 3,
          baseDelay: 1000,
          onRetry: (attempt) => {
            console.log(`Retry attempt ${attempt} for fetching event`);
          },
        }
      );
      setEventData({
        eventName: data.eventName || "",
        eventDate: data.eventDate || "",
        location: data.location || "",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
      });
      setError(null);
    } catch (err: any) {
      console.error("Error fetching event:", err);
      setError(
        extractErrorMessage(
          err,
          "This event could not be found or may have been removed."
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      setIsLoading(true);
      fetchWithRetry(slug);
    }
  }, [slug]);

  // Live countdown timer calculation
  useEffect(() => {
    if (!eventData.eventDate) return;

    const calculateTimeLeft = () => {
      const eventTime = new Date(eventData.eventDate).getTime();
      const now = new Date().getTime();
      const diff = eventTime - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          isPast: false,
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          isPast: true,
        });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [eventData.eventDate]);

  // Handle CTA: connect and open gallery
  const handleSharePhotos = async () => {
    if (!slug) {
      toast.error("Event information is missing");
      return;
    }

    setIsConnecting(true);
    try {
      const toastId = toast.loading("Connecting to celebration...");
      const sessionId = await getOrCreateSession(slug);
      toast.dismiss(toastId);

      navigate("/gallery", {
        state: {
          slug,
          sessionId,
        },
      });
    } catch (err) {
      console.error("Failed to start photo sharing:", err);
      toast.error(
        extractErrorMessage(
          err,
          "Failed to connect to celebration. Please try again."
        )
      );
    } finally {
      setIsConnecting(false);
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="bg-[#131318] text-[#e4e1e9] min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="fixed inset-0 z-[-1] bg-[#0e0e13]">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#ffb0cd]/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#ddb7ff]/10 rounded-full blur-[120px] animate-pulse" />
        </div>
        <div className="w-full max-w-md rounded-[32px] p-6 sm:p-8 flex flex-col items-center text-center bg-white/5 border-0 md:border md:border-white/10 backdrop-blur-2xl animate-pulse space-y-6">
          <div className="w-32 h-32 rounded-full bg-white/10" />
          <div className="h-4 w-28 bg-white/10 rounded-full" />
          <div className="h-10 w-48 bg-white/10 rounded-xl" />
          <div className="h-6 w-36 bg-white/10 rounded-lg" />
          <div className="flex gap-6">
            <div className="w-16 h-16 bg-white/10 rounded-xl" />
            <div className="w-16 h-16 bg-white/10 rounded-xl" />
            <div className="w-16 h-16 bg-white/10 rounded-xl" />
          </div>
          <div className="w-full h-14 bg-white/10 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-[#131318] text-[#e4e1e9] min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="text-center max-w-md bg-white/5 border-0 md:border md:border-white/10 p-8 rounded-3xl backdrop-blur-xl">
          <span className="material-symbols-outlined text-4xl text-[#ffb4ab] mb-3">error</span>
          <h2 className="text-xl font-bold text-white mb-2">Event Not Found</h2>
          <p className="text-sm text-[#debec8] mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => slug && fetchWithRetry(slug)}
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-all cursor-pointer"
            >
              Retry
            </button>
            <button
              onClick={() => navigate("/home")}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#f751a1] to-[#6f00be] text-white text-sm font-semibold transition-all cursor-pointer"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#131318] text-[#e4e1e9] min-h-screen flex flex-col items-center justify-center relative overflow-x-hidden px-4 py-8 selection:bg-[#ffb0cd]/30">
      {/* Ambient Background Lighting */}
      <div className="fixed inset-0 z-[-1] bg-[#131318] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#0e0e13]" />
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#ffb0cd]/20 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#ddb7ff]/20 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-[#ffb0cd]/5 via-transparent to-[#ddb7ff]/5 pointer-events-none" />
      </div>

      {/* Main Content Canvas (No Nav, No Bottom Bar) */}
      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-md mx-auto relative z-10 my-auto">
        {/* Glassmorphism Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full md:rounded-[32px] p-0 md:p-8 flex flex-col items-center text-center relative overflow-hidden md:shadow-2xl md:backdrop-blur-2xl md:bg-white/5 md:border md:border-white/20"
        >
          {/* Subtle internal glow for the card */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#ffb0cd]/20 blur-[60px] rounded-full pointer-events-none" />

          {/* Event Avatar */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10 shadow-lg mb-6 relative z-10 bg-[#1f1f25] flex items-center justify-center shrink-0">
            {eventData.imageUrl ? (
              <img
                alt={eventData.eventName || "Event Avatar"}
                className="w-full h-full object-cover"
                src={eventData.imageUrl}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80";
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#f751a1]/40 to-[#6f00be]/40 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#ffb0cd] text-5xl">
                  celebration
                </span>
              </div>
            )}
          </div>

          {/* Event Status Pill */}
          <div className="relative z-10 mb-4 flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffb0cd]/10 border border-[#ffb0cd]/20 text-[#ffb0cd] text-xs font-bold tracking-widest uppercase animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[#ffb0cd]" />
            {timeLeft.isPast ? "EVENT IS LIVE" : "GET READY"}
          </div>

          {/* Event Title */}
          <h1
            className="font-serif font-bold text-4xl sm:text-5xl md:text-6xl mb-6 text-[#e4e1e9] tracking-widest drop-shadow-lg relative z-10 break-words"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {eventData.eventName || "Celebration"}
          </h1>

          {/* Event Metadata */}
          <div className="flex flex-col gap-3 mb-8 text-[#debec8] text-sm font-semibold relative z-10">
            {eventData.eventDate && (
              <div className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#ffb0cd]">
                  calendar_month
                </span>
                <span>{formatEventDate(eventData.eventDate)}</span>
              </div>
            )}
            {eventData.location && (
              <div className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#ddb7ff]">
                  location_on
                </span>
                <span>{eventData.location}</span>
              </div>
            )}
          </div>

          {/* Countdown Section */}
          {!timeLeft.isPast ? (
            <div className="flex justify-center gap-6 sm:gap-8 mb-6 relative z-10">
              <div className="flex flex-col items-center">
                <span className="text-5xl sm:text-6xl font-bold text-[#ffb0cd] drop-shadow-[0_0_20px_rgba(255,176,205,0.6)]">
                  {timeLeft.days}
                </span>
                <span className="text-xs text-[#debec8]/80 mt-2 tracking-widest uppercase font-semibold">
                  {timeLeft.days === 1 ? "DAY" : "DAYS"}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-5xl sm:text-6xl font-bold text-[#ddb7ff] drop-shadow-[0_0_20px_rgba(221,183,255,0.6)]">
                  {timeLeft.hours}
                </span>
                <span className="text-xs text-[#debec8]/80 mt-2 tracking-widest uppercase font-semibold">
                  {timeLeft.hours === 1 ? "HOUR" : "HOURS"}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-5xl sm:text-6xl font-bold text-[#ffb0cd] drop-shadow-[0_0_20px_rgba(255,176,205,0.6)]">
                  {timeLeft.minutes}
                </span>
                <span className="text-xs text-[#debec8]/80 mt-2 tracking-widest uppercase font-semibold">
                  {timeLeft.minutes === 1 ? "MIN" : "MINS"}
                </span>
              </div>
            </div>
          ) : (
            <div className="mb-6 relative z-10 text-center">
              <p className="text-xl sm:text-2xl font-bold text-[#ffb0cd] drop-shadow-[0_0_20px_rgba(255,176,205,0.6)]">
                🎉 The celebration is underway!
              </p>
            </div>
          )}

          <p className="text-sm text-[#debec8] mb-6 relative z-10">
            Until the celebration begins!
          </p>

          <p className="text-base text-white font-semibold mb-4 relative z-10">
            You all are invited
          </p>

          {/* Social Avatar Stack */}
          <div className="flex flex-col items-center gap-3 mb-8 relative z-10">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#1f1f25] bg-[#2a292f] flex items-center justify-center text-sm shadow">
                🎉
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-[#1f1f25] bg-[#2a292f] flex items-center justify-center text-sm shadow">
                🥂
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-[#1f1f25] bg-[#2a292f] flex items-center justify-center text-[11px] font-bold text-[#debec8] shadow">
                +12
              </div>
            </div>
            <span className="text-xs text-[#debec8]/70 font-semibold uppercase tracking-wider">
              Joining the celebration
            </span>
          </div>

          {/* Call to Action Button */}
          <button
            type="button"
            onClick={handleSharePhotos}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-[#ffb0cd] via-[#f751a1] to-[#ddb7ff] text-[#40000d] rounded-2xl py-4 px-6 flex items-center justify-center gap-3 text-base font-bold shadow-[0_0_30px_rgba(247,81,161,0.4)] active:scale-95 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(247,81,161,0.6)] cursor-pointer disabled:opacity-50 relative z-10"
          >
            {isConnecting ? (
              <>
                <div className="w-5 h-5 border-2 border-[#40000d] border-t-transparent rounded-full animate-spin" />
                <span>Connecting to Gallery...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[22px]">ios_share</span>
                <span>Share Your Photos</span>
              </>
            )}
          </button>

          {/* Footer Text */}
          <p className="mt-6 text-xs sm:text-sm text-[#debec8]/70 text-center max-w-[260px] relative z-10">
            All photos are private and only visible to event attendees
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default Visit;
