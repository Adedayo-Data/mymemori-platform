import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useEvent } from "../context/eventContext";
import { usePicture } from "../context/pictureContext";
import { formatEventDate } from "../utils/dateUtils";
import ShareModal from "../components/ShareModal";

// Confetti Component for Celebration
const ConfettiRain = () => {
  const colors = ["#ffb0cd", "#ddb7ff", "#f751a1", "#6f00be", "#ffd9e4", "#ffdadb"];
  const pieces = Array.from({ length: 45 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2.5,
    duration: 3 + Math.random() * 2.5,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 6 + Math.random() * 8,
    isCircle: Math.random() > 0.5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -30, opacity: 1, rotate: 0 }}
          animate={{
            y: "110vh",
            opacity: [1, 1, 0.8, 0],
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.isCircle ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
};

const Booking = () => {
  const navigate = useNavigate();
  const { createEvent, loading: isEventLoading } = useEvent();
  const { uploadEventImage, loading: isImageLoading } = usePicture();

  // Wizard state: 1: The Spark, 2: The Setting, 3: The Vibe, 4: Review, 5: Live / Success
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [createdSlug, setCreatedSlug] = useState<string>("");
  const [showShareModal, setShowShareModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on Chapter 1
  useEffect(() => {
    if (currentStep === 1) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Restore draft from localStorage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("mymemori_booking_draft");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.eventName) setEventName(parsed.eventName);
        if (parsed.location) setLocation(parsed.location);
        if (parsed.date) setDate(parsed.date);
        if (parsed.time) setTime(parsed.time);
        if (parsed.description) setDescription(parsed.description);
        if (parsed.imageUrl) setImageUrl(parsed.imageUrl);
        if (parsed.imagePreview) setImagePreview(parsed.imagePreview);
        if (parsed.currentStep && parsed.currentStep <= 4) {
          setCurrentStep(parsed.currentStep);
        }
      }
    } catch {
      // ignore draft parse error
    }
  }, []);

  // Save draft on changes (only for active creation steps 1-4)
  useEffect(() => {
    if (currentStep <= 4) {
      const draft = {
        eventName,
        location,
        date,
        time,
        description,
        imageUrl,
        imagePreview,
        currentStep,
      };
      localStorage.setItem("mymemori_booking_draft", JSON.stringify(draft));
    }
  }, [eventName, location, date, time, description, imageUrl, imagePreview, currentStep]);

  const handleEventNameChange = (val: string) => {
    setEventName(val);
  };

  // Image Upload handler
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Local instant preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const uploadedUrl = await uploadEventImage(file);
      setImageUrl(uploadedUrl);
      toast.success("Cover image uploaded!");
    } catch (err) {
      console.error("Cover upload failed:", err);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageUrl(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Validation & navigation between steps
  const goToNextStep = () => {
    if (currentStep === 1) {
      if (!eventName.trim()) {
        toast.error("Please name your story to continue");
        return;
      }
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentStep === 2) {
      if (!location.trim()) {
        toast.error("Please provide a location/stage for this memory");
        return;
      }
      if (!date) {
        toast.error("Please choose a date for this event");
        return;
      }
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (currentStep === 3) {
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1 && currentStep <= 4) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Submit and Publish the Story
  const handlePublishEvent = async () => {
    try {
      const combinedDate = date ? `${date}T${time || "00:00"}` : new Date().toISOString();
      const eventData = {
        eventName: eventName.trim(),
        eventDate: combinedDate,
        location: location.trim(),
        description: description.trim() || `Memories from ${eventName}`,
        imageUrl: imageUrl,
      };

      const response = await createEvent(eventData);
      const generatedSlug = response?.eventSlug || "event";
      setCreatedSlug(generatedSlug);

      // Clear draft
      localStorage.removeItem("mymemori_booking_draft");

      // Advance to Live / Celebration screen
      setCurrentStep(5);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Failed to publish event:", error);
    }
  };

  // Format date display for review & preview
  const displayDateText = () => {
    if (!date) return "Date to be announced";
    try {
      const formatted = formatEventDate(date);
      if (time) {
        const [h, m] = time.split(":");
        const hour = parseInt(h, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${formatted} • ${hour12}:${m} ${ampm}`;
      }
      return formatted;
    } catch {
      return date;
    }
  };

  const eventVisitUrl = `${window.location.origin}/visit/${createdSlug || "event"}/`;

  // Fallback placeholder image when none is uploaded
  const defaultPlaceholderCover = "/images/event-placeholder.jpg";

  return (
    <div className="min-h-screen bg-[#131318] text-[#e4e1e9] antialiased flex flex-col relative overflow-x-hidden selection:bg-[#ffb0cd]/30 selection:text-[#ffb0cd]">
      {/* Ambient Glows / Ethereal Background */}
      <div className="fixed top-[-10%] left-[-10%] w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full bg-[#f751a1]/10 blur-[120px] pointer-events-none animate-pulse z-0" />
      <div
        className="fixed bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] md:w-[50vw] md:h-[50vw] rounded-full bg-[#6f00be]/15 blur-[140px] pointer-events-none z-0"
        style={{ animationDelay: "2s" }}
      />

      {/* Confetti on Live Screen */}
      {currentStep === 5 && <ConfettiRain />}

      <AnimatePresence mode="wait">
        {/* ========================================================= */}
        {/* CHAPTER 1: THE SPARK                                      */}
        {/* ========================================================= */}
        {currentStep === 1 && (
          <motion.div
            key="chapter-1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex-1 flex flex-col justify-between w-full max-w-4xl mx-auto px-4 sm:px-6 relative z-10 min-h-screen"
          >
            {/* Header / Chapter Badge */}
            <header className="pt-10 md:pt-14 pb-4 flex justify-between items-center w-full">
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-[#debec8] hover:text-white transition-all active:scale-95"
                title="Cancel and return home"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>

              <div className="flex items-center space-x-2 bg-[#ddb7ff]/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 shadow-[0_0_15px_rgba(221,183,255,0.15)]">
                <span className="material-symbols-outlined text-[#ddb7ff] text-[18px]">auto_awesome</span>
                <span className="text-xs md:text-sm font-semibold text-[#ddb7ff] tracking-widest uppercase">
                  Chapter 1: The Spark
                </span>
              </div>

              <div className="w-10" />
            </header>

            {/* Centered Content Area */}
            <section className="flex-1 flex flex-col justify-center items-center w-full max-w-2xl mx-auto space-y-8 md:space-y-12 py-12">
              <h1 className="text-3xl md:text-5xl font-bold text-[#e4e1e9] text-center leading-tight drop-shadow-sm tracking-tight">
                What&apos;s the name of this story?
              </h1>

              {/* Glassmorphic Input Field with Focus Glow */}
              <div className="w-full relative group">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-t-xl z-0 transition-colors group-hover:bg-white/10" />
                <input
                  ref={inputRef}
                  type="text"
                  autoComplete="off"
                  value={eventName}
                  onChange={(e) => handleEventNameChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && eventName.trim()) {
                      goToNextStep();
                    }
                  }}
                  placeholder="e.g. Midnight in Tokyo"
                  className="relative z-10 w-full bg-transparent border-0 border-b-2 border-white/20 focus:border-[#ffb0cd] text-center text-xl md:text-2xl font-semibold text-[#e4e1e9] placeholder:text-[#debec8]/40 focus:ring-0 transition-all duration-300 py-6 px-4 rounded-none shadow-none outline-none"
                />
                {/* Animated Focus Glow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#ffb0cd] transition-all duration-500 ease-out group-focus-within:w-full group-focus-within:shadow-[0_0_20px_rgba(255,176,205,0.6)] z-20 pointer-events-none" />
              </div>

              <p className="text-sm md:text-base text-[#debec8]/60 text-center max-w-md">
                Every great memory begins with a spark. Give this chapter a title your guests will remember.
              </p>
            </section>

            {/* Bottom Action Area */}
            <footer className="pb-8 pt-4 flex justify-center w-full">
              <button
                type="button"
                onClick={goToNextStep}
                disabled={!eventName.trim()}
                className={`w-full max-w-sm h-14 rounded-full bg-gradient-to-r from-[#ffb0cd] to-[#ddb7ff] flex items-center justify-center space-x-2 transition-all duration-300 shadow-[0_0_25px_rgba(221,183,255,0.25)] hover:shadow-[0_0_35px_rgba(255,176,205,0.4)] relative overflow-hidden group ${
                  eventName.trim()
                    ? "opacity-100 scale-100 cursor-pointer active:scale-95"
                    : "opacity-40 cursor-not-allowed saturate-50"
                }`}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out pointer-events-none" />
                <span className="text-sm font-bold text-[#131318] uppercase tracking-wider relative z-10">
                  Next Chapter
                </span>
                <span className="material-symbols-outlined text-[#131318] relative z-10 font-bold">
                  arrow_forward
                </span>
              </button>
            </footer>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* CHAPTER 2: THE SETTING                                    */}
        {/* ========================================================= */}
        {currentStep === 2 && (
          <motion.div
            key="chapter-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="min-h-screen flex flex-col relative"
          >
            {/* Top Controls: Back and Cancel icons only (no top bar background, no MyMemori write up) */}
            <header className="flex justify-between items-center px-4 sm:px-6 pt-8 pb-4 w-full max-w-4xl mx-auto z-20">
              <button
                type="button"
                onClick={goToPreviousStep}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-[#e4e1e9] active:scale-95"
                title="Back to Chapter 1"
              >
                <span className="material-symbols-outlined text-[22px]">arrow_back</span>
              </button>
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-[#debec8] active:scale-95"
                title="Close"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </header>

            {/* Main Content Canvas */}
            <main className="flex-1 pt-2 pb-36 px-4 sm:px-6 md:max-w-4xl md:mx-auto w-full z-10 flex flex-col">
              {/* Progress Indicator */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#ddb7ff] w-1/2 rounded-full transition-all duration-500" />
                </div>
                <span className="text-xs md:text-sm font-semibold text-[#ddb7ff] tracking-wide">
                  Chapter 2: The Setting
                </span>
              </div>

              {/* Poetic Prompt */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#e4e1e9] mb-8 tracking-tight leading-tight">
                Where and when
                <br />
                does this story unfold?
              </h1>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Location Input Card: The Stage */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between relative group hover:border-[#ddb7ff]/40 transition-all duration-300">
                  <div className="absolute inset-0 bg-[#ddb7ff]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div>
                    <label
                      htmlFor="location"
                      className="text-lg font-semibold text-[#ddb7ff] mb-1 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[#ddb7ff]">pin_drop</span>
                      The Stage
                    </label>
                    <p className="text-sm text-[#debec8] mb-4">
                      Name the place where these memories were born.
                    </p>

                    <div className="relative mt-2">
                      <input
                        id="location"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g., A dimly lit jazz club in Paris..."
                        className="w-full bg-[#35343a]/70 border-b-2 border-[#574048] focus:border-[#ddb7ff] text-[#e4e1e9] text-base px-4 py-3.5 rounded-t-lg outline-none transition-all placeholder:text-[#debec8]/40"
                      />
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#debec8]/60 pointer-events-none">
                        search
                      </span>
                    </div>
                  </div>

                  {/* Atmospheric Visual Reinforcement */}
                  <div className="mt-6 h-36 rounded-xl overflow-hidden relative border border-white/5">
                    <div
                      className="w-full h-full bg-cover bg-center opacity-70 mix-blend-screen scale-105 group-hover:scale-110 transition-transform duration-700"
                      style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=800&auto=format&fit=crop')`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131318] via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-[#ddb7ff]">
                      <span className="material-symbols-outlined text-[14px]">explore</span>
                      <span>Coordinates for your guests</span>
                    </div>
                  </div>
                </div>

                {/* Date/Time Input Card: The Hour */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between relative group hover:border-[#ffb0cd]/40 transition-all duration-300">
                  <div className="absolute inset-0 bg-[#ffb0cd]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div>
                    <label
                      htmlFor="date"
                      className="text-lg font-semibold text-[#ffb0cd] mb-1 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[#ffb0cd]">schedule</span>
                      The Hour
                    </label>
                    <p className="text-sm text-[#debec8] mb-4">
                      When did the stars align for this moment?
                    </p>

                    <div className="space-y-4 mt-2">
                      <div>
                        <label htmlFor="date" className="block text-xs uppercase tracking-wider text-[#debec8]/70 mb-1">
                          Date
                        </label>
                        <input
                          id="date"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-[#35343a]/70 border-b-2 border-[#574048] focus:border-[#ffb0cd] text-[#e4e1e9] text-base px-4 py-3 rounded-t-lg outline-none transition-all [color-scheme:dark]"
                        />
                      </div>

                      <div>
                        <label htmlFor="time" className="block text-xs uppercase tracking-wider text-[#debec8]/70 mb-1">
                          Time (Optional)
                        </label>
                        <input
                          id="time"
                          type="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="w-full bg-[#35343a]/70 border-b-2 border-[#574048] focus:border-[#ffb0cd] text-[#e4e1e9] text-base px-4 py-3 rounded-t-lg outline-none transition-all [color-scheme:dark]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date preview note */}
                  <div className="mt-6 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#ffb0cd] text-[18px]">event</span>
                    <span className="text-xs text-[#e4e1e9]">
                      {date ? displayDateText() : "Select a date to anchor this memory"}
                    </span>
                  </div>
                </div>
              </div>
            </main>

            {/* Fixed Floating Action Button */}
            <div className="fixed bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-[#131318] via-[#131318]/90 to-transparent z-40 flex justify-center pb-safe pointer-events-none">
              <button
                type="button"
                onClick={goToNextStep}
                disabled={!location.trim() || !date}
                className={`pointer-events-auto w-full md:w-auto md:min-w-[320px] h-14 bg-gradient-to-r from-[#f751a1] to-[#6f00be] hover:from-[#ffb0cd] hover:to-[#ddb7ff] text-white font-semibold py-4 px-8 rounded-full shadow-[0_0_20px_rgba(111,0,190,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group ${
                  location.trim() && date
                    ? "opacity-100 cursor-pointer active:scale-95"
                    : "opacity-40 cursor-not-allowed"
                }`}
              >
                <span>Continue the Tale</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* CHAPTER 3: THE VIBE                                       */}
        {/* ========================================================= */}
        {currentStep === 3 && (
          <motion.div
            key="chapter-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="min-h-screen flex flex-col relative"
          >
            {/* Top Controls: Back and Cancel icons only */}
            <header className="flex justify-between items-center px-4 sm:px-6 pt-8 pb-4 w-full max-w-2xl mx-auto z-20">
              <button
                type="button"
                onClick={goToPreviousStep}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-[#e4e1e9] active:scale-95"
                title="Back to Chapter 2"
              >
                <span className="material-symbols-outlined text-[22px]">arrow_back</span>
              </button>
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-[#debec8] active:scale-95"
                title="Close"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 pt-2 pb-36 px-4 sm:px-6 max-w-2xl mx-auto w-full z-10 flex flex-col gap-8">
              {/* Headline */}
              <div className="text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#e4e1e9] mb-2 tracking-tight">
                  Choose the face of your memory.
                </h1>
                <p className="text-sm md:text-base text-[#debec8]">
                  Upload a high-impact cover image to set the tone for your story.
                </p>
              </div>

              {/* Bento Layout: Cover Uploader (Left) & Note/Description (Right) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start w-full">
                {/* Cover Image Uploader (Left Column) */}
                <div className="md:col-span-5 flex justify-center w-full">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[2/3] rounded-2xl backdrop-blur-md border-2 border-dashed border-white/20 overflow-hidden flex flex-col items-center justify-center group cursor-pointer hover:border-[#ffb0cd]/60 hover:bg-white/10 transition-all duration-300 shadow-[0_0_40px_rgba(247,81,161,0.08)] bg-white/5"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    {/* Atmospheric Background / Preview */}
                    {imagePreview || imageUrl ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreview || imageUrl || ""}
                          alt="Cover preview"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                        {/* Replace / Remove overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                          <span className="material-symbols-outlined text-3xl text-white">edit</span>
                          <span className="text-xs font-semibold text-white bg-black/60 px-3 py-1 rounded-full border border-white/20">
                            Click to Change Cover
                          </span>
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="mt-2 text-xs text-[#ffb4ab] hover:underline flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                            Remove
                          </button>
                        </div>

                        {/* Bottom title preview on cover */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-xs font-semibold text-[#ffb0cd] uppercase tracking-wider">
                            Cover Selected
                          </p>
                          <p className="text-sm font-bold text-white line-clamp-1">{eventName}</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Atmospheric Placeholder Background */}
                        <div
                          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-luminosity group-hover:scale-105 group-hover:opacity-30 transition-all duration-700 ease-out"
                          style={{
                            backgroundImage: `url('${defaultPlaceholderCover}')`,
                          }}
                        />

                        {/* Upload UI Icon & Label */}
                        <div className="relative z-10 flex flex-col items-center gap-4 text-center p-6 w-full h-full justify-center bg-gradient-to-t from-[#131318]/80 via-transparent to-transparent">
                          <div className="w-16 h-16 rounded-full bg-[#f751a1]/20 border border-[#ffb0cd]/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#f751a1]/40 transition-all duration-300 shadow-[0_0_20px_rgba(255,176,205,0.2)]">
                            {isImageLoading ? (
                              <div className="w-6 h-6 border-2 border-[#ffb0cd] border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <span className="material-symbols-outlined text-3xl text-[#ffb0cd] drop-shadow-[0_0_10px_rgba(255,176,205,0.8)]">
                                add_photo_alternate
                              </span>
                            )}
                          </div>

                          <div>
                            <p className="text-lg text-white font-semibold">Upload Cover</p>
                            <p className="text-xs text-[#debec8] mt-1">Tap to browse files</p>
                          </div>

                          <span className="text-[11px] text-[#debec8]/50 px-2 py-0.5 rounded bg-white/5 border border-white/5">
                            Recommended: 2:3 or vertical photo
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Column: Note / Description & Guide */}
                <div className="md:col-span-7 flex flex-col gap-4 w-full">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="description" className="text-xs font-semibold text-[#ddb7ff] ml-1 uppercase tracking-wider">
                      Memory Note / Description (Optional)
                    </label>
                    <textarea
                      id="description"
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="A brief greeting or prompt for your guests..."
                      className="w-full rounded-xl bg-white/5 border border-white/10 p-4 text-sm text-white placeholder:text-[#debec8]/30 outline-none focus:border-[#ddb7ff] focus:bg-white/10 transition-all resize-none"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-[#debec8]/70 flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#ffb0cd] text-[18px] shrink-0 mt-0.5">
                      auto_stories
                    </span>
                    <span>
                      This cover sets the mood for your guests and serves as the visual book jacket for your live gallery album.
                    </span>
                  </div>
                </div>
              </div>
            </main>

            {/* Fixed Bottom Action Area */}
            <div className="fixed bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-[#131318] via-[#131318]/90 to-transparent z-40 flex justify-center pb-safe pointer-events-none">
              <button
                type="button"
                onClick={goToNextStep}
                className="pointer-events-auto w-full md:w-auto md:min-w-[320px] h-14 rounded-full bg-gradient-to-r from-[#f751a1] to-[#6f00be] hover:from-[#ffb0cd] hover:to-[#ddb7ff] text-white text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_4px_30px_rgba(247,81,161,0.3)] active:scale-95 group"
              >
                <span className="relative z-10">Review Your Story</span>
                <span className="material-symbols-outlined relative z-10 text-[20px]">
                  auto_awesome
                </span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* CHAPTER 4: REVIEW YOUR STORY                              */}
        {/* ========================================================= */}
        {currentStep === 4 && (
          <motion.div
            key="chapter-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="min-h-screen flex flex-col relative"
          >
            {/* Top Controls: Back and Cancel icons only */}
            <header className="flex justify-between items-center px-4 sm:px-6 pt-8 pb-4 w-full max-w-5xl mx-auto z-20">
              <button
                type="button"
                onClick={goToPreviousStep}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-[#e4e1e9] active:scale-95"
                title="Back to Chapter 3"
              >
                <span className="material-symbols-outlined text-[22px]">arrow_back</span>
              </button>
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-[#debec8] active:scale-95"
                title="Close"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 pt-2 pb-36 px-4 sm:px-6 max-w-5xl mx-auto w-full z-10">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#ffb0cd] to-[#ddb7ff] bg-clip-text text-transparent tracking-tight mb-8">
                Review Your Story
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* Final Preview Section (Left Column) */}
                <section className="md:col-span-5 relative group">
                  <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden backdrop-blur-md bg-white/5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
                    <img
                      src={imageUrl || imagePreview || defaultPlaceholderCover}
                      alt="Story Cover Preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Glass Overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-16">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-0.5 rounded-full bg-[#6f00be]/40 text-[#ddb7ff] text-xs font-semibold border border-[#ddb7ff]/30 backdrop-blur-md">
                          Live Event
                        </span>
                        <span className="text-xs text-[#debec8]/80">{location || "Stage Unset"}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-1 leading-tight line-clamp-2">
                        {eventName || "Untitled Memory"}
                      </h2>
                      <p className="text-xs text-[#ffb0cd] font-medium">{displayDateText()}</p>
                    </div>
                  </div>

                  {/* Edit Cover quick button */}
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 backdrop-blur-lg border border-white/20 text-white p-2 rounded-full transition-all active:scale-95 shadow-lg flex items-center justify-center"
                    title="Change Cover Image"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                </section>

                {/* The Narrative Section (Right Column) */}
                <section className="md:col-span-7 flex flex-col space-y-4">
                  {/* The Spark Details Card */}
                  <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-5 relative group hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-1.5">
                      <h3 className="text-base font-semibold text-[#ffb0cd] flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#ffb0cd]/80 text-[18px]">
                          auto_awesome
                        </span>
                        The Spark
                      </h3>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="text-[#debec8]/60 hover:text-[#ffb0cd] p-1 rounded-full transition-colors"
                        title="Edit Spark / Name"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                    </div>
                    <p className="text-lg font-bold text-[#e4e1e9]">{eventName || "Untitled Story"}</p>
                  </div>

                  {/* The Setting Details Card */}
                  <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-5 relative group hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-1.5">
                      <h3 className="text-base font-semibold text-[#ddb7ff] flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#ddb7ff]/80 text-[18px]">
                          location_on
                        </span>
                        The Setting
                      </h3>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-[#debec8]/60 hover:text-[#ddb7ff] p-1 rounded-full transition-colors"
                        title="Edit Setting / Date & Location"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                    </div>
                    <p className="text-base font-semibold text-[#e4e1e9] mb-1">{displayDateText()}</p>
                    <p className="text-sm text-[#debec8] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#ddb7ff]">
                        pin_drop
                      </span>
                      {location || "No location set"}
                    </p>
                  </div>

                  {/* The Vibe Details Card */}
                  <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-5 relative group hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-1.5">
                      <h3 className="text-base font-semibold text-[#ffb2b7] flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#ffb2b7]/80 text-[18px]">
                          auto_stories
                        </span>
                        The Vibe & Note
                      </h3>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="text-[#debec8]/60 hover:text-[#ffb2b7] p-1 rounded-full transition-colors"
                        title="Edit Cover & Note"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                    </div>
                    <p className="text-sm text-[#e4e1e9]">
                      {imageUrl || imagePreview ? "Custom cover image uploaded" : "Default atmospheric cover selected"}
                    </p>
                    {description ? (
                      <p className="text-xs text-[#debec8]/70 mt-2 italic">&ldquo;{description}&rdquo;</p>
                    ) : (
                      <p className="text-xs text-[#debec8]/50 mt-1">No additional note provided</p>
                    )}
                  </div>

                  {/* Primary Action Button */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handlePublishEvent}
                      disabled={isEventLoading}
                      className="w-full h-14 bg-gradient-to-r from-[#f751a1] via-[#b4136d] to-[#6f00be] hover:from-[#ffb0cd] hover:to-[#ddb7ff] text-white font-bold text-base md:text-lg rounded-full shadow-[0_0_30px_rgba(247,81,161,0.5)] hover:shadow-[0_0_40px_rgba(247,81,161,0.7)] transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 group cursor-pointer disabled:opacity-50"
                    >
                      {isEventLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Publishing the Magic...</span>
                        </>
                      ) : (
                        <>
                          <span>Publish the Magic</span>
                          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                            send
                          </span>
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-[#debec8]/50 mt-3">
                      Your event will be instantly created with live QR access for your guests.
                    </p>
                  </div>
                </section>
              </div>
            </main>
          </motion.div>
        )}

        {/* ========================================================= */}
        {/* CHAPTER 5: STORY IS LIVE (CELEBRATION & ACTIONS)          */}
        {/* ========================================================= */}
        {currentStep === 5 && (
          <motion.div
            key="chapter-5"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-10 relative z-20 w-full max-w-5xl mx-auto"
          >
            <div className="w-full flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-12 items-center">
              {/* Mobile Write-up Header (Rendered BEFORE the image on mobile) */}
              <div className="text-center md:hidden mb-2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#ddb7ff]/20 border border-[#ddb7ff]/30 mb-3 shadow-[0_0_30px_rgba(221,183,255,0.4)]">
                  <span className="material-symbols-outlined text-3xl text-[#ddb7ff]">auto_awesome</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#ffb0cd] mb-1.5 tracking-tight">
                  Your story is ready to be told.
                </h1>
                <p className="text-sm text-[#debec8]">
                  The magic is live. Invite others to weave their memories.
                </p>
              </div>

              {/* Left Column: Event Card Preview */}
              <div className="md:col-span-5 flex justify-center w-full">
                <div className="w-full max-w-sm bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-3 shadow-[0_0_40px_rgba(247,81,161,0.2)]">
                  <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden group">
                    <img
                      src={imageUrl || imagePreview || defaultPlaceholderCover}
                      alt={eventName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131318]/95 via-[#131318]/40 to-transparent" />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end text-left">
                      <div className="inline-flex items-center space-x-2 bg-[#6f00be]/40 backdrop-blur-md rounded-full px-3 py-1 mb-3 self-start border border-[#ddb7ff]/30">
                        <span className="material-symbols-outlined text-[14px] text-[#ddb7ff]">flare</span>
                        <span className="text-xs font-semibold text-[#ddb7ff]">Live Event</span>
                      </div>

                      <h2 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
                        {eventName || "Untitled Story"}
                      </h2>

                      <div className="flex flex-col space-y-1 text-sm text-[#debec8]">
                        <div className="flex items-center space-x-2">
                          <span className="material-symbols-outlined text-[16px] text-[#ffb0cd]">
                            calendar_month
                          </span>
                          <span>{displayDateText()}</span>
                        </div>
                        {location && (
                          <div className="flex items-center space-x-2">
                            <span className="material-symbols-outlined text-[16px] text-[#ddb7ff]">
                              location_on
                            </span>
                            <span>{location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Success Header & Action Buttons (Side-by-side on desktop) */}
              <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left space-y-6 w-full">
                {/* Desktop Write-up Header (Hidden on mobile, shown on desktop) */}
                <div className="hidden md:block">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#ddb7ff]/20 border border-[#ddb7ff]/30 mb-4 shadow-[0_0_30px_rgba(221,183,255,0.4)]">
                    <span className="material-symbols-outlined text-3xl text-[#ddb7ff]">auto_awesome</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#ffb0cd] mb-2 tracking-tight">
                    Your story is ready to be told.
                  </h1>
                  <p className="text-sm md:text-base text-[#debec8]">
                    The magic is live. Invite others to weave their memories.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="w-full max-w-md flex flex-col space-y-3 pt-2">
                  {/* Primary Share Action */}
                  <button
                    type="button"
                    onClick={() => setShowShareModal(true)}
                    className="w-full relative group overflow-hidden rounded-2xl bg-gradient-to-r from-[#f751a1] to-[#6f00be] p-[1px] active:scale-98 transition-transform duration-200 shadow-[0_0_25px_rgba(247,81,161,0.35)] hover:shadow-[0_0_35px_rgba(247,81,161,0.55)] cursor-pointer"
                  >
                    <div className="relative bg-[#131318]/70 backdrop-blur-md rounded-[15px] px-6 py-4 flex items-center justify-between z-10 hover:bg-[#131318]/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className="material-symbols-outlined text-white text-[22px]">share</span>
                        <div className="text-left">
                          <p className="text-sm font-bold text-white leading-tight">Share the Magic</p>
                          <p className="text-[11px] text-[#debec8]/70">QR Code, Invitations & Direct Link</p>
                        </div>
                      </div>
                      <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center p-1 shadow-sm">
                        <span className="material-symbols-outlined text-[#131318] text-[22px]">
                          qr_code_2
                        </span>
                      </div>
                    </div>
                  </button>

                  {/* Secondary Action: Go to Gallery */}
                  <button
                    type="button"
                    onClick={() => {
                      const targetSlug = createdSlug || "event";
                      navigate(`/gallery?event=${targetSlug}`);
                    }}
                    className="w-full bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl px-6 py-4 flex items-center justify-center space-x-2 active:scale-98 transition-all duration-200 text-[#e4e1e9] cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[#debec8]">photo_library</span>
                    <span className="text-sm font-semibold">Go to Gallery</span>
                  </button>

                  {/* Tertiary: Return to Home */}
                  <button
                    type="button"
                    onClick={() => navigate("/home")}
                    className="w-full text-xs text-[#debec8]/60 hover:text-white py-2 transition-colors text-center md:text-left md:pl-2"
                  >
                    ← Return to Dashboard
                  </button>
                </div>
              </div>
            </div>

            {/* Reusable Share Modal */}
            <ShareModal
              isOpen={showShareModal}
              onClose={() => setShowShareModal(false)}
              eventTitle={eventName}
              eventSlug={createdSlug || "event"}
              eventLink={eventVisitUrl}
              onGenerateCard={() => {
                setShowShareModal(false);
                navigate("/share-details", {
                  state: {
                    qrCodeValue: eventVisitUrl,
                    eventData: {
                      eventName,
                      eventDate: date,
                      location,
                      description,
                      imageUrl,
                    },
                    eventSlug: createdSlug || "event",
                  },
                });
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Booking;
