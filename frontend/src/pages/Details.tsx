import { useState } from "react";
import {
  Heart,
  Download,
  Share2,
  Mail,
  Copy,
  Check,
  MoreVertical,
  Bell,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

const Details = () => {
  const [copied, setCopied] = useState(false);
  const eventLink = "ourviews.com/chidi-eleanor";

  const handleCopy = () => {
    navigator.clipboard.writeText(eventLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    console.log(`Sharing via ${platform}`);
    alert(`Sharing via ${platform}`);
  };

  const handleDownloadQR = () => {
    console.log("Downloading QR code");
    alert("QR Code downloaded!");
  };

  const handleDownloadTemplate = () => {
    console.log("Downloading table card template");
    alert("Table card template downloaded!");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
              <span className="text-xl font-bold text-gray-800">Our Views</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/profile"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Dashboard
              </Link>
              <Link to="/details" className="text-pink-500 font-medium">
                Events
              </Link>
              <Link
                to="/gallery"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Gallery
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 bg-pink-100 rounded-full">
              <User className="w-5 h-5 text-pink-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Chidi & Eleanor's Wedding
            </h1>
            <p className="text-gray-500">December 14, 2024</p>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors border border-pink-200">
            <MoreVertical className="w-4 h-4" />
            Options
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Left Column - QR Code */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Share with Your Guests
            </h2>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              {/* QR Code Display */}
              <div className="bg-gray-900 rounded-xl p-8 flex items-center justify-center mb-4">
                <div className="bg-white p-6 rounded-lg">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-32 h-32"
                    fill="currentColor"
                  >
                    <rect x="0" y="0" width="20" height="20" />
                    <rect x="30" y="0" width="10" height="10" />
                    <rect x="50" y="0" width="10" height="10" />
                    <rect x="70" y="0" width="10" height="10" />
                    <rect x="80" y="0" width="20" height="20" />
                    <rect x="0" y="10" width="10" height="10" />
                    <rect x="10" y="10" width="10" height="10" />
                    <rect x="80" y="10" width="10" height="10" />
                    <rect x="90" y="10" width="10" height="10" />
                    <rect x="0" y="30" width="10" height="10" />
                    <rect x="20" y="30" width="10" height="10" />
                    <rect x="40" y="30" width="10" height="10" />
                    <rect x="60" y="30" width="10" height="10" />
                    <rect x="80" y="30" width="10" height="10" />
                    <rect x="0" y="40" width="10" height="10" />
                    <rect x="30" y="40" width="10" height="10" />
                    <rect x="50" y="40" width="20" height="20" />
                    <rect x="80" y="40" width="10" height="10" />
                    <rect x="0" y="70" width="10" height="10" />
                    <rect x="20" y="70" width="10" height="10" />
                    <rect x="40" y="70" width="10" height="10" />
                    <rect x="60" y="70" width="10" height="10" />
                    <rect x="80" y="70" width="10" height="10" />
                    <rect x="0" y="80" width="20" height="20" />
                    <rect x="30" y="80" width="10" height="10" />
                    <rect x="50" y="80" width="10" height="10" />
                    <rect x="70" y="80" width="10" height="10" />
                    <rect x="80" y="80" width="20" height="20" />
                    <rect x="10" y="90" width="10" height="10" />
                    <rect x="90" y="90" width="10" height="10" />
                  </svg>
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

            <div className="bg-pink-50 rounded-2xl border border-pink-100 p-6">
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
                  onClick={() => handleShare("WhatsApp")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <Share2 className="w-4 h-4 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">
                    Share via WhatsApp
                  </span>
                </button>

                <button
                  onClick={() => handleShare("Email")}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <Mail className="w-4 h-4 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">
                    Share via Email
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

          <button
            onClick={handleDownloadTemplate}
            className="w-full bg-pink-50 text-pink-600 py-4 rounded-xl hover:bg-pink-100 transition-colors flex items-center justify-center gap-2 font-medium border border-pink-100"
          >
            <Download className="w-5 h-5" />
            Download Table Card Template
          </button>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10 text-pink-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Awaiting your beautiful moments!
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Your gallery is empty right now. Share this event with your guests
            to start collecting memories and photos from your special day.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Details;
