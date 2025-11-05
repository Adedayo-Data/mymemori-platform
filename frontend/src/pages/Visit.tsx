import { Upload, MapPin, Calendar } from "lucide-react";
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
    eventImage?: string;
  } | null>(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const data = await getEventBySlug(slug || "");
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
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: eventData?.eventImage
            ? `url(${eventData.eventImage})`
            : "linear-gradient(to br, rgb(250, 204, 21), rgb(249, 115, 22))",
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full">
          {/* Main Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Content */}
            <div className="px-8 py-12 text-center">
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {eventData?.eventName || "Your Event"}
              </h1>

              {/* Event Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                {/* Date */}
                {eventData?.eventDate && (
                  <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                      <p className="text-xs text-blue-600 font-medium">Date</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(eventData.eventDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {/* Location */}
                {eventData?.location && (
                  <div className="flex items-center justify-center gap-3 p-4 bg-purple-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <div className="text-left">
                      <p className="text-xs text-purple-600 font-medium">
                        Location
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {eventData.location}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              {eventData?.description && (
                <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                  {eventData.description}
                </p>
              )}

              {/* Upload Button */}
              <button
                onClick={handleSharePhotos}
                className="group px-8 py-4 bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 hover:scale-105 mx-auto"
              >
                <Upload className="w-5 h-5" />
                Share Photos
              </button>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center mt-8">
            <p className="text-white text-sm">
              Powered by <span className="font-semibold">MyMemori</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visit;
