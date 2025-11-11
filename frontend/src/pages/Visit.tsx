import { Upload, MapPin, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEvent } from "../context/eventContext";
import apiClient from "../api/apiClient";
import toast from "react-hot-toast";

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
  const { getEventBySlug } = useEvent();

  useEffect(() => {
    const fetchEventData = async () => {
      if (slug) {
        try {
          const data = await getEventBySlug(slug);
          setEventData({
            eventName: data.eventName || "",
            eventDate: data.eventDate || "",
            location: data.location || "",
            description: data.description || "",
            imageUrl: data.imageUrl || "",
          });
        } catch (error) {
          console.error("Failed to fetch event data:", error);
        }
      }
    };

    fetchEventData();
  }, [slug, getEventBySlug]);

  const createNewSession = async (eventSlug: string): Promise<string> => {
    try {
      const response = await apiClient.post('/api/public/create-session', {
        eventSlug,
        deviceType: 'web'
      });
      
      const { sessionId } = response.data;
      if (!sessionId) throw new Error('No session ID in response');
      
      localStorage.setItem('sessionId', sessionId);
      return sessionId;
    } catch (error) {
      console.error('Failed to create session:', error);
      throw new Error('Failed to create a new session');
    }
  };

  const handleSharePhotos = async () => {
    if (!slug) {
      toast.error('Event information is missing');
      return;
    }

    try {
      // Get or create session ID
      let sessionId = localStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = await createNewSession(slug);
      }

      // Navigate to gallery with both slug and sessionId
      navigate("/gallery", { 
        state: { 
          slug,
          sessionId
        } 
      });
    } catch (error) {
      console.error('Failed to start photo sharing:', error);
      toast.error('Failed to start photo sharing. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-950">
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: eventData?.imageUrl
            ? `url(${eventData.imageUrl})`
            : "bg-gradient-to-r from-white/0 via-white/20 to-white/0",
        }}
      >
        {/* Improved gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/50 to-black/70"></div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-80 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          {/* Main Card with enhanced styling */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
            <div className="px-6 sm:px-10 py-5 sm:py-14">
              {/* Title with better typography */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 text-center leading-tight">
                {eventData?.eventName || "Your Event"}
              </h1>

              {/* Subtitle */}
              <p className="text-white/80 text-center mb-8 text-lg">
                Create lasting memories together
              </p>

              {/* Event Info Cards with improved design */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-10">
                {/* Date Card */}
                {eventData?.eventDate && (
                  <div className="group relative overflow-hidden bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/25 transition-all duration-300">
                    <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-start gap-4">
                      <div className="p-3 bg-blue-500/30 rounded-xl">
                        <Calendar className="w-6 h-6 text-blue-200" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-xs text-blue-200 font-semibold uppercase tracking-wide mb-1">
                          Date
                        </p>
                        <p className="text-base font-bold text-white">
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
                  </div>
                )}

                {/* Location Card */}
                {eventData?.location && (
                  <div className="group relative overflow-hidden bg-white/15 backdrop-blur-md rounded-2xl p-5 border border-white/20 hover:bg-white/25 transition-all duration-300">
                    <div className="absolute inset-0 bg-linear-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-start gap-4">
                      <div className="p-3 bg-purple-500/30 rounded-xl">
                        <MapPin className="w-6 h-6 text-purple-200" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-xs text-purple-200 font-semibold uppercase tracking-wide mb-1">
                          Location
                        </p>
                        <p className="text-base font-bold text-white">
                          {eventData.location}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description with better styling */}
              {eventData?.description && (
                <p className="text-white/90 text-base sm:text-lg leading-relaxed text-center py-4 -mt-5">
                  {eventData.description}
                </p>
              )}

              {/* Enhanced Upload Button */}
              <button
                onClick={handleSharePhotos}
                className="group relative w-full sm:w-auto mx-auto flex items-center justify-center gap-3 px-10 py-4 bg-linear-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-pink-500/50 hover:shadow-pink-500/70 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <Upload className="w-6 h-6 relative z-10" />
                <span className="relative z-10">Share Your Photos</span>
              </button>

              {/* Additional info */}
              <p className="text-white/60 text-sm text-center mt-6">
                All photos are private and only visible to event attendees
              </p>
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="text-center mt-8 space-y-2">
            <p className="text-white/80 text-sm flex items-center justify-center gap-2">
              Powered by
              <span className="font-bold bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                MyMemori
              </span>
            </p>
            <p className="text-white/50 text-xs">
              Capture and share your special moments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visit;
