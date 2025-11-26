import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Image as ImageIcon, Heart, Users, MapPin, Camera, Plus } from "lucide-react";
import ProfilePanel from "../components/ProfilePanel";

// Mock data - will be replaced with real API calls
const mockEvents = {
  created: [
    { id: "1", name: "Sarah's Birthday Party", date: "2024-01-15", location: "NYC", imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400", photoCount: 45, guestCount: 23 },
    { id: "2", name: "Summer BBQ 2024", date: "2024-06-20", location: "LA", imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400", photoCount: 67, guestCount: 34 },
  ],
  attended: [
    { id: "3", name: "John's Wedding", date: "2024-03-10", location: "Miami", imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400", photoCount: 120, guestCount: 89 },
  ],
};

const mockPictures = {
  yours: [
    { id: "1", imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400", eventName: "Sarah's Birthday", date: "2024-01-15", likes: 12 },
    { id: "2", imageUrl: "https://images.unsplash.com/photo-1464047736614-af63643285bf?w=400", eventName: "Summer BBQ", date: "2024-06-20", likes: 8 },
    { id: "3", imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400", eventName: "Beach Day", date: "2024-07-04", likes: 15 },
    { id: "4", imageUrl: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400", eventName: "Concert Night", date: "2024-08-12", likes: 20 },
  ],
  liked: [
    { id: "5", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", eventName: "John's Wedding", date: "2024-03-10", likes: 45 },
    { id: "6", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400", eventName: "Mountain Trip", date: "2024-05-22", likes: 32 },
  ],
};

const NewHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mainTab, setMainTab] = useState<"events" | "pictures">("events");
  const [eventsSubTab, setEventsSubTab] = useState<"created" | "attended">("created");
  const [picturesSubTab, setPicturesSubTab] = useState<"yours" | "liked">("yours");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Check if we should open profile panel based on route
  useEffect(() => {
    if (location.state?.openProfile) {
      setIsProfileOpen(true);
      // Clear the state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Title */}
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              MyMemories
            </h1>

            {/* Main Tabs - Inline with title */}
            <div className="flex">
              <button
                onClick={() => setMainTab("events")}
                className={`relative py-2 px-4 font-medium text-sm transition-all rounded-lg ${
                  mainTab === "events"
                    ? "text-pink-600 bg-pink-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Events</span>
                </div>
              </button>

              <button
                onClick={() => setMainTab("pictures")}
                className={`relative py-2 px-4 font-medium text-sm transition-all rounded-lg ${
                  mainTab === "pictures"
                    ? "text-pink-600 bg-pink-50"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  <span>Pictures</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {mainTab === "events" ? (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Events Sub-tabs */}
              <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button
                  onClick={() => setEventsSubTab("created")}
                  className={`relative pb-3 px-1 font-medium text-sm transition-colors ${
                    eventsSubTab === "created"
                      ? "text-pink-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Created ({mockEvents.created.length})
                  {eventsSubTab === "created" && (
                    <motion.div
                      layoutId="eventsSubTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"
                    />
                  )}
                </button>

                <button
                  onClick={() => setEventsSubTab("attended")}
                  className={`relative pb-3 px-1 font-medium text-sm transition-colors ${
                    eventsSubTab === "attended"
                      ? "text-pink-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Attended ({mockEvents.attended.length})
                  {eventsSubTab === "attended" && (
                    <motion.div
                      layoutId="eventsSubTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"
                    />
                  )}
                </button>
              </div>

              {/* Events Grid - 2 cols mobile, 3 cols tablet, 4 cols desktop */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(eventsSubTab === "created" ? mockEvents.created : mockEvents.attended).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="pictures"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Pictures Sub-tabs */}
              <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button
                  onClick={() => setPicturesSubTab("yours")}
                  className={`relative pb-3 px-1 font-medium text-sm transition-colors ${
                    picturesSubTab === "yours"
                      ? "text-pink-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Your Pictures ({mockPictures.yours.length})
                  {picturesSubTab === "yours" && (
                    <motion.div
                      layoutId="picturesSubTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"
                    />
                  )}
                </button>

                <button
                  onClick={() => setPicturesSubTab("liked")}
                  className={`relative pb-3 px-1 font-medium text-sm transition-colors ${
                    picturesSubTab === "liked"
                      ? "text-pink-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Liked Pictures ({mockPictures.liked.length})
                  {picturesSubTab === "liked" && (
                    <motion.div
                      layoutId="picturesSubTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"
                    />
                  )}
                </button>
              </div>

              {/* Pictures Grid - 2 cols mobile, 3 cols tablet, 4 cols desktop */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(picturesSubTab === "yours" ? mockPictures.yours : mockPictures.liked).map((picture) => (
                  <PictureCard key={picture.id} picture={picture} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/book")}
        className="fixed bottom-20 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center z-50 transition-shadow"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Profile Panel */}
      <ProfilePanel isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
};

// Event Card Component
const EventCard = ({ event }: { event: any }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
    >
      <div className="relative aspect-[4/3]">
        <img
          src={event.imageUrl}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Camera className="w-3 h-3 text-pink-600" />
          <span className="text-xs font-medium">{event.photoCount}</span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm mb-1 truncate">{event.name}</h3>
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
          <Calendar className="w-3 h-3" />
          <span>{new Date(event.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <MapPin className="w-3 h-3" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Users className="w-3 h-3" />
          <span>{event.guestCount} guests</span>
        </div>
      </div>
    </motion.div>
  );
};

// Picture Card Component
const PictureCard = ({ picture }: { picture: any }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group"
    >
      <div className="relative aspect-square">
        <img
          src={picture.imageUrl}
          alt={picture.eventName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Heart className="w-3 h-3 text-pink-600 fill-pink-600" />
          <span className="text-xs font-medium">{picture.likes}</span>
        </div>
      </div>
      <div className="p-2">
        <p className="text-xs font-medium truncate">{picture.eventName}</p>
        <p className="text-xs text-gray-500">{new Date(picture.date).toLocaleDateString()}</p>
      </div>
    </motion.div>
  );
};

export default NewHome;
