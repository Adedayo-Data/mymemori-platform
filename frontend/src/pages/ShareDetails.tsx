import { useState, useRef } from "react";
import Navigation from "../components/Navigation";
import BottomNav from "../components/BottomNav";
import { Download, Share2, Mail, Copy, Check, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import domtoimage from "dom-to-image";
import toast from "react-hot-toast";

const Details = () => {
  const [copied, setCopied] = useState(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const tableCardRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { qrCodeValue, eventData } = location.state || {};

  const eventLink = qrCodeValue;

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

    console.log(`Element found for ${filename}, proceeding with dom-to-image`);
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
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-pink-50 overflow-x-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/event-list")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Events</span>
        </button>

        {/* Title Section */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {eventData?.title || eventData?.eventName || "Event Details"}
            </h1>
            <p className="text-sm font-bold text-gray-900 mb-2">
              {eventData?.location || "Event location"}
            </p>
            <p className="text-gray-500">
              {eventData?.date ||
                (eventData?.eventDate
                  ? new Date(eventData.eventDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Date not available")}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Left Column - QR Code */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Share with Your Guests
            </h2>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mr-10 ">
              {/* QR Code Display */}
              <div
                ref={qrCodeRef}
                className="bg-gray-900 rounded-xl p-8 flex items-center justify-center mb-4"
              >
                <div className="bg-white p-4 md:p-6 rounded-lg">
                  {qrCodeValue ? (
                    <QRCodeSVG
                      value={qrCodeValue}
                      size={240}
                      className="w-50 md:w-full"
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
          </div>

          {/* Right Column - Share Options */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 opacity-0">
              .
            </h2>

            <div className="bg-pink-50 rounded-2xl border border-pink-100 p-6 mr-10 md:mr-0">
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">
                  Your short link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={eventLink}
                    readOnly
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2.5 bg-white border border-pink-200 text-pink-600 rounded-lg hover:bg-pink-50 transition-colors flex items-center gap-2 font-medium"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleShare("whatsapp")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <Share2 className="w-4 h-4 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">
                    WhatsApp
                  </span>
                </button>

                <button
                  onClick={() => handleShare("email")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <Mail className="w-4 h-4 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">
                    Email
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table Cards Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            For Your Tables
          </h2>

          <div
            id="table"
            ref={tableCardRef}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6"
          >
            {/* Printable Table Card - Compact & Stylish */}
            <div className="max-w-xs mx-auto">
              {/* Card Container - Compact design */}
              <div
                className="relative bg-linear-to-br from-pink-50 via-white to-purple-50 rounded-2xl shadow-xl overflow-hidden border border-pink-200 p-5"
                style={{ aspectRatio: "3/4" }}
              >
                {/* Subtle Top Accent */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-pink-400 to-purple-400"></div>

                {/* Content Container */}
                <div className="h-full flex flex-col justify-between items-center">
                  {/* Top Section - Minimal Event Info */}
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

                  {/* Middle Section - QR Code */}
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

                  {/* Bottom Section - Link */}
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

                  {/* Subtle Bottom Accent */}
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
            Download Table Card as Image
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Details;
