import { Upload, MapPin, Calendar, RefreshCw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEvent } from "../context/eventContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { retryWithBackoff } from "../utils/retryUtils";
import { getOrCreateSession } from "../utils/sessionUtils";
import { formatEventDate } from "../utils/dateUtils";

// Countdown Timer Component
const CountdownTimer = ({ eventDate }: { eventDate: string }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDateTime = new Date(eventDate).getTime();
      const now = new Date().getTime();
      const difference = eventDateTime - now;

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          isPast: false,
        };
      } else {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true,
        };
      }
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  if (!timeLeft) return null;

  if (timeLeft.isPast) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6"
      >
        <p className="text-pink-400 font-semibold text-lg">
          🎉 The event has begun!
        </p>
      </motion.div>
    );
  }

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6"
      >
        <p className="text-pink-400 font-semibold text-lg">
          ✨ Event is starting today!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-6 my-6"
    >
      <div className="flex items-center justify-center gap-6 flex-wrap">
        {timeLeft.days > 0 && (
          <div className="text-center">
            <motion.div
              key={timeLeft.days}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
            >
              {timeLeft.days}
            </motion.div>
            <div className="text-xs text-white/60 uppercase tracking-wide mt-1">
              {timeLeft.days === 1 ? "Day" : "Days"}
            </div>
          </div>
        )}
        {(timeLeft.days > 0 || timeLeft.hours > 0) && (
          <div className="text-center">
            <motion.div
              key={timeLeft.hours}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
            >
              {timeLeft.hours}
            </motion.div>
            <div className="text-xs text-white/60 uppercase tracking-wide mt-1">
              {timeLeft.hours === 1 ? "Hour" : "Hours"}
            </div>
          </div>
        )}
        <div className="text-center">
          <motion.div
            key={timeLeft.minutes}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
          >
            {timeLeft.minutes}
          </motion.div>
          <div className="text-xs text-white/60 uppercase tracking-wide mt-1">
            {timeLeft.minutes === 1 ? "Minute" : "Minutes"}
          </div>
        </div>
      </div>
      <p className="text-white/70 text-sm mt-4 font-medium">
        Until the celebration begins!
      </p>
    </motion.div>
  );
};

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="min-h-screen w-full bg-gray-950 relative overflow-hidden">
    {/* Animated background */}
    <div className="absolute inset-0">
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
    </div>

    <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden p-6 sm:p-10">
          {/* Title skeleton */}
          <div className="h-12 bg-white/20 rounded-lg mb-4 animate-pulse"></div>
          <div className="h-6 bg-white/10 rounded-lg mb-8 w-3/4 mx-auto animate-pulse"></div>

          {/* Cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-10">
            <div className="bg-white/15 rounded-2xl p-5 h-24 animate-pulse"></div>
            <div className="bg-white/15 rounded-2xl p-5 h-24 animate-pulse"></div>
          </div>

          {/* Button skeleton */}
          <div className="h-14 bg-white/20 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

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
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getEventBySlug } = useEvent();
  const imageRef = useRef<HTMLDivElement>(null);

  const fetchWithRetry = async (slug: string): Promise<void> => {
    try {
      const data = await retryWithBackoff(
        async () => await getEventBySlug(slug),
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
    } 
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      setIsLoading(true);
      fetchWithRetry(slug);
    }
  }, [slug]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
    if (imageRef.current) {
      imageRef.current.style.opacity = "1";
    }
  };

  const handleSharePhotos = async () => {
    if (!slug) {
      toast.error("Event information is missing");
      return;
    }

    try {
      const toastId = toast.loading("Preparing photo sharing...");

      try {
        const sessionId = await getOrCreateSession(slug);

        toast.dismiss(toastId);
        navigate("/gallery", {
          state: {
            slug,
            sessionId,
          },
        });
      } catch (error) {
        toast.dismiss(toastId);
        throw error;
      }
    } catch (error) {
      console.error("Failed to start photo sharing:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to start photo sharing. Please try again."
      );
    }
  };

  // Show skeleton loader
  if (isLoading) {
    return <SkeletonLoader />;
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-950 p-4">
        <div className="text-center max-w-md">
          <div className="text-red-400 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            onClick={() => slug && fetchWithRetry(slug)}
            className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg flex items-center justify-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen w-full overflow-hidden bg-gray-950"
    >
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out opacity-0"
        style={{
          backgroundImage: eventData?.imageUrl
            ? `url(${eventData.imageUrl})`
            : "none",
          opacity: isImageLoaded ? 1 : 0,
          transition: "opacity 1s ease-in-out",
          willChange: "opacity",
        }}
        aria-hidden="true"
      >
        {/* Preload the image */}
        {eventData?.imageUrl && (
          <img
            src={eventData.imageUrl}
            alt=""
            className="hidden"
            onLoad={handleImageLoad}
            onError={() => {
              console.error("Failed to load background image");
              setIsImageLoaded(true);
            }}
          />
        )}

        {/* Gradient overlay */}
        <div
          ref={imageRef}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Fallback gradient background */}
      {!isImageLoaded && (
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
          aria-hidden="true"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl w-full"
        >
          {/* Main Card with enhanced styling */}
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-pink-500/20 transition-all duration-500"
          >
            {/* Hero Image Section */}
            {eventData?.imageUrl && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isImageLoaded ? 1 : 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center justify-center pt-10"
              >
                <img
                  src={eventData.imageUrl}
                  alt={eventData.eventName}
                  className="w-40 h-40 object-cover rounded-full"
                  onLoad={handleImageLoad}
                  onError={() => {
                    console.error("Failed to load event image");
                    setIsImageLoaded(true);
                  }}
                />
              </motion.div>
            )}

            <div className="px-6 sm:px-10 py-8 sm:py-14">
              {/* Title with elegant serif font */}
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 text-center leading-tight tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {eventData?.eventName || "Your Event"}
              </motion.h1>

              {/* Consolidated Metadata Row */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-white/80 mb-2"
              >
                {eventData?.eventDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-300" />
                    <span className="text-sm sm:text-base">
                      {formatEventDate(eventData.eventDate)}
                    </span>
                  </div>
                )}
                {eventData?.eventDate && eventData?.location && (
                  <span className="text-white/40">•</span>
                )}
                {eventData?.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-300" />
                    <span className="text-sm sm:text-base">
                      {eventData.location}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Countdown Timer */}
              {eventData?.eventDate && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <CountdownTimer eventDate={eventData.eventDate} />
                </motion.div>
              )}

              {/* Description */}
              {eventData?.description && (
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="text-white/90 text-base sm:text-lg leading-relaxed text-center py-4"
                >
                  {eventData.description}
                </motion.p>
              )}

              {/* Enhanced Upload Button */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSharePhotos}
                className="group relative w-full sm:w-auto mx-auto flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-pink-500/50 hover:shadow-pink-500/70 transition-all duration-300 overflow-hidden mt-6"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <Upload className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform" />
                <span className="relative z-10">Share Your Photos</span>
              </motion.button>

              {/* Additional info */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="text-white/60 text-sm text-center mt-6"
              >
                All photos are private and only visible to event attendees
              </motion.p>
            </div>
          </motion.div>

          {/* Enhanced Footer */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="text-center mt-8 space-y-2"
          >
            <p className="text-white/80 text-sm flex items-center justify-center gap-2">
              Powered by
              <span className="font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                MyMemori
              </span>
            </p>
            <p className="text-white/50 text-xs">
              Capture and share your special moments
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Visit;
