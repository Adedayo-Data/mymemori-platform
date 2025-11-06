import { useMemo } from "react";
import Navigation from "../components/Navigation";
import BottomNav from "../components/BottomNav";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EventList = () => {
  const navigate = useNavigate();

  // Mock events data - in real app, this would come from context/API
  const eventsCreated = useMemo(
    () => [
      {
        id: 1,
        title: "Olivia & Liam's Wedding",
        date: "Oct 18, 2024",
        location: "Grand Ballroom, NYC",
        slug: "olivia-liam",
        color: "from-rose-200 to-pink-300",
      },
      {
        id: 2,
        title: "The Chen Engagement Party",
        date: "Aug 15, 2024",
        location: "Sunset Gardens",
        slug: "chen-engagement",
        color: "from-emerald-200 to-teal-300",
      },
    ],
    []
  );

  const handleSelectEvent = (event: any) => {
    navigate("/share-details", {
      state: {
        eventData: event,
        qrCodeValue: `${window.location.origin}/visit/${event.slug}/`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-pink-50 overflow-x-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Events</h1>
          <p className="text-gray-600">
            Select an event to view its details, QR code, and sharing options
          </p>
        </div>

        {/* Event Selection Section */}
        <div>
          {eventsCreated.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Events Created Yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create your first event to generate QR codes and share links
                with your guests.
              </p>
              <button
                onClick={() => navigate("/booking")}
                className="px-6 py-3 bg-linear-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 font-medium transition-all shadow-lg"
              >
                Create Your First Event
              </button>
            </div>
          ) : (
            /* Event Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventsCreated.map((event) => (
                <button
                  key={event.id}
                  onClick={() => handleSelectEvent(event)}
                  className="group relative overflow-hidden bg-white rounded-xl border-2 border-gray-200 hover:border-pink-400 transition-all duration-300 p-6 text-left hover:shadow-xl hover:scale-[1.02]"
                >
                  {/* Color Accent Bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r ${event.color}`}
                  ></div>

                  {/* Event Info */}
                  <h3 className="font-bold text-gray-900 mb-2 text-lg line-clamp-2 group-hover:text-pink-600 transition-colors">
                    {event.title}
                  </h3>
                  <div className="space-y-1.5">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span>📅</span>
                      <span>{event.date}</span>
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-2 line-clamp-1">
                      <span>📍</span>
                      <span>{event.location}</span>
                    </p>
                  </div>

                  {/* Hover Arrow */}
                  <div className="mt-4 flex items-center text-pink-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default EventList;
