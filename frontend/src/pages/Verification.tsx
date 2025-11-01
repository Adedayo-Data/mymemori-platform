import { useState } from "react";
import { QrCode } from "lucide-react";
import GalleryCard from "../components/GalleryCard";
import { useNavigate } from "react-router-dom";

const Verification = () => {
  const [eventCode, setEventCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const recentEvents = [
    {
      id: 1,
      title: "Olivia & Liam's Wedding",
      date: "December 14, 2024",
      image: "from-green-50 to-emerald-50",
      icon: "💐",
    },
    {
      id: 2,
      title: "Emma & Noah's Reception",
      date: "November 8, 2024",
      image: "from-blue-100 to-sky-100",
      icon: "👫",
    },
    {
      id: 3,
      title: "Ava & James' Celebration",
      date: "October 20, 2024",
      image: "from-amber-900 to-orange-950",
      icon: "🎂",
    },
  ];

  const handleJoinWithCode = () => {
    if (!eventCode.trim()) {
      alert("Please enter an event code");
      return;
    }

    setIsSubmitting(true);
    console.log("Joining with code:", eventCode);

    setTimeout(() => {
      navigate("/visit");
      setIsSubmitting(false);
    }, 1000);
  };

  const handleScanQR = () => {
    console.log("Opening QR scanner");
    alert("Opening camera to scan QR code...");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-rose-50 to-pink-100 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-rose-200 rounded-full opacity-20 blur-3xl"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Join Card */}
        <div className="max-w-md mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-8">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Join the Celebration
              </h1>
              <p className="text-gray-600">
                Enter the code from your invitation or scan the QR code to start
                sharing photos.
              </p>
            </div>

            {/* Event Code Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Code
              </label>
              <input
                type="text"
                value={eventCode}
                onChange={(e) => setEventCode(e.target.value.toUpperCase())}
                placeholder="e.g., JDNW-MMDC-2024"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-center text-lg font-mono tracking-wider"
                maxLength={20}
              />
            </div>

            {/* Join Button */}
            <button
              onClick={handleJoinWithCode}
              disabled={isSubmitting}
              className="w-full bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {isSubmitting ? "Joining..." : "Join with Code"}
            </button>

            {/* Scan QR Button */}
            <button
              onClick={handleScanQR}
              className="w-full bg-pink-50 text-pink-600 font-medium py-3.5 rounded-xl hover:bg-pink-100 transition-all flex items-center justify-center gap-2 border border-pink-200"
            >
              <QrCode className="w-5 h-5" />
              Scan QR Code
            </button>

            {/* Help Text */}
            <p className="text-center text-sm text-gray-500 mt-6">
              First time here? No problem, you can access account after joining.
            </p>
          </div>
        </div>

        {/* Recent Events Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Recent events you've joined
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEvents.map((event) => (
              <GalleryCard
                key={event.id}
                title={event.title}
                date={event.date}
                image={event.image}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
