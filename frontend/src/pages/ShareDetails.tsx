import { useState, useRef, useEffect } from "react";
import { Download, Share2, Mail, Copy, Check, ArrowLeft, Sparkles, ExternalLink, Facebook, Twitter } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import domtoimage from "dom-to-image";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { formatEventDate } from "../utils/dateUtils";

// Confetti Component
const Confetti = () => {
  const colors = ['#ec4899', '#f43f5e', '#a855f7', '#3b82f6', '#f59e0b'];
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ 
            y: window.innerHeight + 20, 
            opacity: 0,
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1)
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeIn"
          }}
          style={{
            position: 'absolute',
            left: `${piece.left}%`,
            width: '10px',
            height: '10px',
            backgroundColor: piece.color,
          }}
          className="rounded-sm"
        />
      ))}
    </div>
  );
};

const Details = () => {
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const tableCardRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { qrCodeValue, eventData } = location.state || {};

  const eventLink = qrCodeValue;

  // Hide confetti after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(eventLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const text = `Join me at ${eventData?.title || eventData?.eventName}!`;
    switch (platform) {
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text + " " + eventLink)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventLink)}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(eventLink)}`,
          "_blank"
        );
        break;
      case "email":
        window.location.href = `mailto:?subject=${encodeURIComponent(
          eventData?.eventName
        )}&body=${encodeURIComponent(text + " " + eventLink)}`;
        break;
    }
  };

  const downloadAsImage = async (
    ref: React.RefObject<HTMLDivElement | null>,
    filename: string
  ) => {
    if (!ref.current) {
      toast.error("Element not found for download");
      return;
    }

    try {
      const blob = await domtoimage.toBlob(ref.current, {
        bgcolor: "#ffffff",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
      toast.success(`${filename} downloaded!`);
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  const handleDownloadQR = () => {
    downloadAsImage(qrCodeRef, "qr-code.png");
  };

  const handleDownloadTemplate = () => {
    downloadAsImage(tableCardRef, "table-card.png");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-pink-50 overflow-x-hidden relative">
      {/* Confetti Animation */}
      {showConfetti && <Confetti />}

      {/* Background Decorations */}
      <div className="fixed top-10 right-10 w-72 h-72 bg-pink-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div className="fixed bottom-10 left-10 w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Back Button */}
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => navigate("/event-list")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Events</span>
        </motion.button>

        {/* Celebration Header */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-pink-500 to-purple-500 rounded-full mb-4 shadow-lg"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            🎉 Your Event is Live!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share the QR code or link with your guests to start collecting memories
          </p>
        </motion.div>

        {/* Event Info Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {eventData?.title || eventData?.eventName || "Event Details"}
              </h2>
              <p className="text-gray-600">
                {eventData?.location || "Event location"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {eventData?.date ||
                  (eventData?.eventDate
                    ? formatEventDate(eventData.eventDate)
                    : "Date not available")}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(eventLink, "_blank")}
              className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Preview</span>
            </motion.button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* QR Code Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-1"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              QR Code
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div
                ref={qrCodeRef}
                className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-6 flex items-center justify-center mb-4"
              >
                <div className="bg-white p-4 rounded-lg shadow-inner">
                  {qrCodeValue ? (
                    <QRCodeSVG
                      value={qrCodeValue}
                      size={200}
                      level="H"
                    />
                  ) : (
                    <p className="text-sm text-gray-500">
                      Loading QR Code...
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleDownloadQR}
                className="w-full bg-pink-50 text-pink-600 py-3 rounded-lg hover:bg-pink-100 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Download className="w-4 h-4" />
                Download QR Code
              </button>
            </div>
          </motion.div>

          {/* Share Options */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Share with Guests
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
              {/* Link Copy */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Link
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={eventLink}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center gap-2 font-medium whitespace-nowrap"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Link
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Social Share Buttons - Redesigned */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Share on Social Media
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-2 gap-3">
                  {/* WhatsApp */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare("whatsapp")}
                    className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors border border-green-200"
                  >
                    <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    <span className="hidden sm:inline text-sm font-semibold text-green-700">WhatsApp</span>
                  </motion.button>

                  {/* Facebook */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare("facebook")}
                    className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors border border-blue-200"
                  >
                    <Facebook className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    <span className="hidden sm:inline text-sm font-semibold text-blue-700">Facebook</span>
                  </motion.button>

                  {/* Twitter */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare("twitter")}
                    className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 bg-sky-50 rounded-xl hover:bg-sky-100 transition-colors border border-sky-200"
                  >
                    <Twitter className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600" />
                    <span className="hidden sm:inline text-sm font-semibold text-sky-700">Twitter</span>
                  </motion.button>

                  {/* Email */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare("email")}
                    className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                    <span className="hidden sm:inline text-sm font-semibold text-gray-700">Email</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Table Card Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Table Card Template
          </h2>
          <p className="text-gray-600 mb-6">
            Print this card and place it on your tables for easy guest access
          </p>

          <div
            id="table"
            ref={tableCardRef}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6"
          >
            <div className="max-w-xs mx-auto">
              <div
                className="relative bg-linear-to-br from-pink-50 via-white to-purple-50 rounded-2xl shadow-xl overflow-hidden border border-pink-200 p-5"
                style={{ aspectRatio: "3/4" }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-pink-400 to-purple-400"></div>

                <div className="h-full flex flex-col justify-between items-center">
                  <div className="text-center">
                    <h1
                      className="text-lg font-black tracking-tight bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-0.5"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {eventData?.title ||
                        eventData?.eventName ||
                        "Your Event"}
                    </h1>
                    <p className="text-xs text-gray-500 font-light tracking-widest uppercase">
                      {eventData?.location || "Location"}
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-white rounded-xl p-2.5 shadow-md border border-pink-100">
                      {qrCodeValue ? (
                        <QRCodeSVG
                          value={qrCodeValue}
                          size={220}
                          level="H"
                        />
                      ) : (
                        <div className="w-[110px] h-[110px] bg-gray-200 rounded flex items-center justify-center">
                          <p className="text-gray-500 text-xs">QR</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-center w-full px-2">
                    <p className="text-xs text-gray-400 font-light mb-1.5 tracking-widest">
                      SCAN OR VISIT
                    </p>
                    <p
                      className="text-xs font-mono text-pink-600 font-semibold break-all"
                      style={{
                        fontFamily: "Courier New, monospace",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {eventLink
                        ? eventLink.replace(/^https?:\/\//, "")
                        : "event.link"}
                    </p>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-purple-400 to-pink-400"></div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleDownloadTemplate}
            className="w-full bg-linear-to-r from-pink-500 to-purple-500 text-white py-4 rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg flex items-center justify-center gap-2 font-medium"
          >
            <Download className="w-5 h-5" />
            Download Table Card
          </button>
        </motion.div>

        {/* What's Next Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-linear-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border border-pink-100"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">What's Next?</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => window.open(eventLink, "_blank")}
              className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-left"
            >
              <ExternalLink className="w-6 h-6 text-pink-500 mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">View Event Page</h4>
              <p className="text-sm text-gray-600">See how guests will experience it</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => navigate("/gallery", { state: { slug: eventData?.eventSlug } })}
              className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-left"
            >
              <Share2 className="w-6 h-6 text-purple-500 mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Go to Gallery</h4>
              <p className="text-sm text-gray-600">Start uploading photos</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => navigate("/book")}
              className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-left"
            >
              <Sparkles className="w-6 h-6 text-blue-500 mb-2" />
              <h4 className="font-semibold text-gray-900 mb-1">Create Another</h4>
              <p className="text-sm text-gray-600">Make a new event</p>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Details;
