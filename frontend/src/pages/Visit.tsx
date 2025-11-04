import { Upload, Heart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useEvent } from "../context/eventContext";

const Visit = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { getEventBySlug } = useEvent();
  const [eventData, setEventData] = useState<{
    eventName?: string;
    eventDate?: string;
    location?: string;
    description?: string;
  } | null>(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const data = await getEventBySlug(slug || ""); // already returns parsed data
        setEventData(data);
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchEventData();
    }
  }, [slug]);

  const handleSharePhotos = () => {
    navigate("/gallery");
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image Grid */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-3">
        {/* Top Left - Couple Portrait */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-blue-400 to-blue-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-white/20 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Top Middle - Dark Texture */}
        <div className="relative overflow-hidden bg-gray-900">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-pink-500/30 rounded-full blur-xl"></div>
          </div>
        </div>

        {/* Top Right - Bride with Bouquet */}
        <div className="relative overflow-hidden bg-linear-to-br from-amber-900 to-red-900">
          <div className="absolute inset-0 flex items-end justify-center p-8">
            <div className="w-24 h-24 bg-white/10 rounded-full"></div>
          </div>
        </div>

        {/* Bottom Left - Ring Close-up */}
        <div className="relative overflow-hidden bg-linear-to-br from-gray-100 to-gray-200">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-amber-400 flex items-center justify-center">
                <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              </div>
              <div className="absolute top-0 -right-2 w-4 h-4 bg-amber-300 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Bottom Middle - Main Content Area */}
        <div className="relative overflow-hidden bg-gray-800 md:col-span-1"></div>

        {/* Bottom Right - Dancing Couple */}
        <div className="relative overflow-hidden bg-linear-to-br from-orange-800 to-red-900">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-40 bg-white/10 rounded-full blur-sm"></div>
          </div>
        </div>
      </div>

      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-6 ">
        <div className="max-w-2xl text-center border border-gray-500 rounded-2xl p-5 ">
          {/* Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {eventData?.eventName || "Event"}
          </h1>
          <p className="text-lg md:text-sm text-gray-200 mb-8 max-w-xl mx-auto">
            {eventData?.location || "Description"}
          </p>
          <p className="text-lg md:text-sm text-gray-200 mb-8 max-w-xl mx-auto">
            {eventData?.eventDate || "Description"}
          </p>
          {/* Subtitle */}
          <p className="text-lg md:text-2xl text-gray-200 mb-8 max-w-xl mx-auto">
            {eventData?.description || "Description"}
          </p>

          {/* CTA Button */}
          <button
            onClick={handleSharePhotos}
            className="group px-8 py-4 bg-linear-to-r cursor-pointer from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full font-semibold text-lg shadow-2xl hover:shadow-pink-500/50 transition-all flex items-center gap-3 mx-auto hover:scale-105"
          >
            <Upload className="w-5 h-5" />
            Share Photos
          </button>
        </div>
      </div>

      {/* Decorative floating hearts */}
      <Heart className="absolute top-20 left-10 w-6 h-6 text-pink-400 fill-pink-400 opacity-60 animate-pulse" />
      <Heart
        className="absolute bottom-32 right-16 w-8 h-8 text-rose-400 fill-rose-400 opacity-40 animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <Heart
        className="absolute top-1/3 right-1/4 w-5 h-5 text-pink-300 fill-pink-300 opacity-50 animate-pulse"
        style={{ animationDelay: "2s" }}
      />
    </div>
  );
};

export default Visit;
