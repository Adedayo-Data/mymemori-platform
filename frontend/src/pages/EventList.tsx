import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEvent } from "../context/eventContext";
import { useAuth } from "../context/authContext";
import HomeTopNav from "../components/HomeTopNav";
import HomeBottomNav from "../components/HomeBottomNav";
import { formatShortDate } from "../utils/dateUtils";

interface EventCard {
  id: string;
  title: string;
  date: string;
  rawDate: string;
  location: string;
  slug: string;
  imageUrl?: string;
  description?: string;
}

const EventList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getAllEvent } = useEvent();
  const [eventsCreated, setEventsCreated] = useState<EventCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const events = await getAllEvent();
        const transformedEvents: EventCard[] = (events || []).map((event: any) => ({
          id: event._id || event.eventSlug,
          title: event.eventName || "Untitled Event",
          date: event.eventDate ? formatShortDate(event.eventDate) : "TBD",
          rawDate: event.eventDate || "",
          location: event.location || "",
          slug: event.eventSlug || "event",
          imageUrl: event.imageUrl || "",
          description: event.description || "",
        }));

        setEventsCreated(transformedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEventsCreated([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [getAllEvent]);

  const handleSelectEvent = (event: EventCard) => {
    const visitUrl = `${window.location.origin}/visit/${event.slug}/`;
    navigate("/share-details", {
      state: {
        qrCodeValue: visitUrl,
        eventData: {
          eventName: event.title,
          eventDate: event.rawDate,
          location: event.location,
          description: event.description,
          imageUrl: event.imageUrl,
        },
        eventSlug: event.slug,
      },
    });
  };

  return (
    <div className="bg-[#131318] text-[#e4e1e9] min-h-screen flex flex-col antialiased relative overflow-x-hidden selection:bg-[#ffb0cd]/30">
      {/* Ambient Glow Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#ffb0cd]/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#ddb7ff]/10 blur-[120px]" />
      </div>

      {/* Top Nav */}
      <HomeTopNav
        mainTab="pictures"
        onTabChange={(tab) => {
          if (tab === "home") navigate("/home");
          else if (tab === "events") navigate("/join");
        }}
        onOpenProfile={() => navigate("/profile")}
        user={user}
      />

      {/* Main Canvas */}
      <main className="flex-grow pt-24 pb-28 px-4 sm:px-6 md:px-8 z-10 relative max-w-5xl mx-auto w-full">
        {/* Header Row */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Your Archives
            </h1>
            <p className="text-xs sm:text-sm text-[#debec8]/80 mt-1">
              All memories and celebrations hosted on your account
            </p>
          </div>
          <span className="text-xs text-[#debec8] bg-white/5 px-3 py-1.5 rounded-full border border-white/10 font-semibold shrink-0">
            {eventsCreated.length} {eventsCreated.length === 1 ? "Story" : "Stories"}
          </span>
        </div>

        {/* Content State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 h-36 animate-pulse"
              />
            ))}
          </div>
        ) : eventsCreated.length === 0 ? (
          <div className="bg-white/5 rounded-3xl border border-white/10 p-12 text-center max-w-md mx-auto my-12 backdrop-blur-xl">
            <div className="w-16 h-16 rounded-full bg-white/10 text-[#ffb0cd] flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">auto_stories</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Stories in Your Archive</h3>
            <p className="text-sm text-[#debec8]/80 mb-6 leading-relaxed">
              Create an event or join a celebration to begin capturing memories in your archive.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => navigate("/book")}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#f751a1] to-[#6f00be] text-white font-semibold text-sm shadow-lg hover:scale-98 active:scale-95 transition-all cursor-pointer"
              >
                Create Event
              </button>
              <button
                type="button"
                onClick={() => navigate("/join")}
                className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-all cursor-pointer"
              >
                Join Event
              </button>
            </div>
          </div>
        ) : (
          /* Bento Grid / Card Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsCreated.map((event) => {
              const isLive =
                event.rawDate && new Date(event.rawDate).getTime() >= Date.now() - 86400000;

              return (
                <div
                  key={event.id}
                  onClick={() => handleSelectEvent(event)}
                  className="group relative block w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-white/15 transition-transform duration-200 active:scale-[0.98] hover:scale-[1.01] hover:shadow-xl cursor-pointer"
                >
                  {/* Top Gradient Stripe */}
                  <div className="h-1.5 bg-gradient-to-r from-[#ffb0cd] via-[#f751a1] to-[#6f00be] w-full" />

                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <h2 className="text-lg font-bold text-[#0e0e13] truncate group-hover:text-[#b4136d] transition-colors">
                        {event.title}
                      </h2>

                      {isLive ? (
                        <span className="text-[10px] text-white bg-[#f751a1] px-2.5 py-0.5 rounded-full flex items-center gap-1 font-semibold shrink-0 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          Live
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#574048] bg-gray-100 px-2.5 py-0.5 rounded-full font-semibold shrink-0">
                          Saved
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs text-[#574048]">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-[#8c0053]">
                          calendar_today
                        </span>
                        <span className="font-medium">{event.date}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 truncate">
                          <span className="material-symbols-outlined text-[16px] text-[#6f00be]">
                            location_on
                          </span>
                          <span className="font-medium truncate">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <HomeBottomNav
        mainTab="pictures"
        onTabChange={(tab) => {
          if (tab === "home") navigate("/home");
          else if (tab === "events") navigate("/join");
        }}
        onOpenProfile={() => navigate("/profile")}
        onCreateClick={() => navigate("/book")}
      />
    </div>
  );
};

export default EventList;
