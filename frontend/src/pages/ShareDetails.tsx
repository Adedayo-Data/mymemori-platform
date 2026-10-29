import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import domtoimage from "dom-to-image";
import toast from "react-hot-toast";
import ShareModal from "../components/ShareModal";

const ShareDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { qrCodeValue, eventData, eventSlug } = location.state || {};

  const targetSlug = eventSlug || eventData?.eventSlug || "event";
  const eventLink =
    qrCodeValue || `${window.location.origin}/visit/${targetSlug}/`;
  const eventTitle =
    eventData?.eventName || eventData?.title || "My Memory";
  const eventLocation = eventData?.location || "";

  const storyCardRef = useRef<HTMLDivElement>(null);
  const qrOnlyRef = useRef<HTMLDivElement>(null);

  const [isDownloadingCard, setIsDownloadingCard] = useState(false);
  const [isDownloadingQR, setIsDownloadingQR] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Option 1: Download the complete 9:16 Story Card
  const handleDownloadStoryCard = async () => {
    if (!storyCardRef.current) return;
    setIsDownloadingCard(true);
    try {
      const blob = await domtoimage.toBlob(storyCardRef.current, {
        bgcolor: "#0e0e13",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      const safeName = eventTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      link.download = `${safeName || "story"}-card.png`;
      link.click();
      URL.revokeObjectURL(link.href);
      toast.success("Story Card downloaded!");
    } catch (error) {
      console.error("Failed to download story card:", error);
      toast.error("Failed to download image. You can also take a screenshot.");
    } finally {
      setIsDownloadingCard(false);
    }
  };

  // Option 2: Download the standalone QR Code alone
  const handleDownloadQRAlone = async () => {
    if (!qrOnlyRef.current) return;
    setIsDownloadingQR(true);
    try {
      const blob = await domtoimage.toBlob(qrOnlyRef.current, {
        bgcolor: "#ffffff",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      const safeName = eventTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      link.download = `${safeName || "event"}-qr-code.png`;
      link.click();
      URL.revokeObjectURL(link.href);
      toast.success("QR Code downloaded!");
    } catch (error) {
      console.error("Failed to download QR code:", error);
      toast.error("Failed to download QR code.");
    } finally {
      setIsDownloadingQR(false);
    }
  };

  return (
    <div className="bg-[#131318] text-[#e4e1e9] min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 relative overflow-x-hidden selection:bg-[#ffb0cd]/30">
      {/* Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full bg-[#f751a1]/10 blur-[120px] pointer-events-none animate-pulse z-0" />
      <div
        className="fixed bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] md:w-[50vw] md:h-[50vw] rounded-full bg-[#6f00be]/15 blur-[140px] pointer-events-none z-0"
        style={{ animationDelay: "2s" }}
      />

      {/* Top Navigation */}
      <header className="w-full max-w-sm md:max-w-4xl lg:max-w-5xl flex justify-between items-center z-10 pt-4 pb-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-[#debec8] hover:text-white transition-all active:scale-95 cursor-pointer"
          title="Go back"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        <span className="text-xs font-bold text-[#ffb0cd] uppercase tracking-widest">
          Story Card
        </span>

        <button
          type="button"
          onClick={() => navigate("/home")}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-[#debec8] hover:text-white transition-all active:scale-95 cursor-pointer"
          title="Dashboard"
        >
          <span className="material-symbols-outlined text-[20px]">home</span>
        </button>
      </header>

      {/* Main Content Area - Flexed beside each other on desktop */}
      <main className="relative z-10 w-full max-w-sm md:max-w-4xl lg:max-w-5xl flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 my-auto py-4">
        {/* Mobile Write-up Header */}
        <div className="md:hidden text-center space-y-1 w-full">
          <h2 className="text-xl font-bold text-white leading-tight">Ready to Share</h2>
          <p className="text-xs text-[#debec8]/80">Download for stories or print out for your guests</p>
        </div>

        {/* The Downloadable Story Card (9:16 Aspect Ratio) */}
        <div className="w-full max-w-[320px] sm:max-w-[340px] shrink-0">
          <div
            ref={storyCardRef}
            id="story-card"
            className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 group bg-[#0e0e13] transition-transform duration-300 hover:scale-[1.01]"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#ffb0cd]/15 to-[#ddb7ff]/15 p-[2px] rounded-2xl">
              <div className="w-full h-full bg-[#0e0e13] rounded-2xl flex flex-col items-center p-6 relative overflow-hidden justify-between text-center">
                {/* Internal Ambient Radial Glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(247,81,161,0.25)_0%,transparent_70%)] pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center w-full h-full justify-between py-2">
                  {/* Top: Brand, Title & Location */}
                  <div className="text-center space-y-1">
                    <span className="text-xs font-semibold text-[#ffb0cd] uppercase tracking-widest block font-sora">
                      MyMemori
                    </span>
                    <h1 className="text-2xl md:text-3xl font-bold text-white line-clamp-2 leading-tight">
                      {eventTitle}
                    </h1>
                    {eventLocation && (
                      <p className="text-[11px] text-[#debec8] uppercase tracking-widest line-clamp-1">
                        {eventLocation}
                      </p>
                    )}
                  </div>

                  {/* Center: QR Code Container */}
                  <div className="bg-white p-4 rounded-2xl shadow-2xl transform transition-transform hover:scale-105 my-2">
                    <div className="w-52 h-52 sm:w-56 sm:h-56 flex items-center justify-center">
                      <QRCodeSVG
                        value={eventLink}
                        size={216}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                  </div>

                  {/* Bottom: Scan or Visit */}
                  <div className="text-center space-y-1">
                    <span className="text-[11px] text-[#debec8] uppercase tracking-widest block">
                      Scan or Visit
                    </span>
                    <p className="text-sm text-[#ffb0cd] font-bold tracking-tight">
                      mymemori.com/visit/{targetSlug}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Container for Downloading Standalone QR Code Only */}
        <div className="fixed -left-[9999px] top-0 pointer-events-none">
          <div
            ref={qrOnlyRef}
            className="w-[500px] h-[500px] bg-white flex flex-col items-center justify-center p-8 text-center text-black"
          >
            <QRCodeSVG value={eventLink} size={360} level="H" includeMargin={false} />
            <h2 className="text-2xl font-bold text-gray-900 mt-4 line-clamp-1">
              {eventTitle}
            </h2>
            <p className="text-sm text-gray-500 font-mono mt-1">
              mymemori.com/visit/{targetSlug}
            </p>
          </div>
        </div>

        {/* Right Column (Desktop): Write-up, Actions & Print Tips */}
        <div className="w-full md:max-w-md flex flex-col items-center md:items-start text-center md:text-left space-y-5">
          {/* Desktop Write-up Header */}
          <div className="hidden md:block space-y-2">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Invite your guests to contribute
            </h1>
            <p className="text-sm text-[#debec8]/80 leading-relaxed">
              Save your high-resolution 9:16 story card to post on Instagram and WhatsApp, or download the standalone QR code for table prints and signage.
            </p>
          </div>

          {/* Download Action Buttons: 2 Options */}
          <div className="w-full flex flex-col gap-3">
            {/* Option 1: Download Story Card (Full 9:16 Poster) */}
            <button
              type="button"
              onClick={handleDownloadStoryCard}
              disabled={isDownloadingCard}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#f751a1] to-[#6f00be] hover:from-[#ffb0cd] hover:to-[#ddb7ff] text-white font-semibold text-base shadow-[0_0_20px_rgba(247,81,161,0.4)] hover:scale-98 transition-transform duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isDownloadingCard ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Card...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">download</span>
                  <span>Download Story Card (Card + QR)</span>
                </>
              )}
            </button>

            {/* Option 2: Download QR Code alone */}
            <button
              type="button"
              onClick={handleDownloadQRAlone}
              disabled={isDownloadingQR}
              className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isDownloadingQR ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Downloading QR...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px] text-[#ffb0cd]">
                    qr_code_2
                  </span>
                  <span>Download QR Code Alone</span>
                </>
              )}
            </button>

            {/* Open Share the Magic Modal */}
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="w-full py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-[#debec8] hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-white/10"
            >
              <span className="material-symbols-outlined text-[18px] text-[#ffb0cd]">
                share
              </span>
              <span>Share the Magic (Apps & Link)</span>
            </button>
          </div>

          {/* Desktop Print & Display Tip */}
          <div className="hidden md:flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-[#debec8]/70 leading-relaxed">
            <span className="material-symbols-outlined text-[#ffb0cd] text-[18px] shrink-0 mt-0.5">
              tips_and_updates
            </span>
            <span>
              Tip: Place printed QR cards at entrance tables or guest dining tables so guests can effortlessly scan and upload their photos directly to the gallery.
            </span>
          </div>
        </div>
      </main>

      {/* Footer Navigation Link */}
      <footer className="w-full max-w-sm md:max-w-4xl lg:max-w-5xl flex justify-center py-4 z-10">
        <button
          type="button"
          onClick={() => navigate(`/gallery?event=${targetSlug}`)}
          className="text-xs text-[#debec8]/70 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">photo_library</span>
          <span>View Event Gallery</span>
        </button>
      </footer>

      {/* Reusable Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        eventTitle={eventTitle}
        eventSlug={targetSlug}
        eventLink={eventLink}
      />
    </div>
  );
};

export default ShareDetails;
