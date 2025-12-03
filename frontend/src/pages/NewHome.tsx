import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Image as ImageIcon, Users, MapPin, Camera, Plus } from "lucide-react";
import ProfilePanel from "../components/ProfilePanel";
import { useEvent } from "../context/eventContext";
import { usePicture } from "../context/pictureContext";

interface Event {
  eventName: string;
  eventDate: string;
  location: string;
  description: string;
  eventSlug: string;
  imageUrl: string;
  [key: string]: string;
}

interface Photo {
  photoId: string;
  imageUrl: string;
  uploader: string;
  uploadedAt: string;
  type: string;
  size: string;
  color: string;
}

const NewHome = () => {
    const navigate = useNavigate();
    const {getAllEvent} = useEvent()
    const {getAllPhoto} = usePicture()
  const location = useLocation();
  const [mainTab, setMainTab] = useState<"events" | "pictures">("events");
  const [eventsSubTab, setEventsSubTab] = useState<"created" | "attended">("created");
  const [picturesSubTab, setPicturesSubTab] = useState<"yours" | "liked">("yours");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [userPhotos, setUserPhotos] = useState<Photo[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);

  // Check if we should open profile panel based on route
  useEffect(() => {
    if (location.state?.openProfile) {
      setIsProfileOpen(true);
      // Clear the state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  // Fetch all events and photos on component load
  useEffect(() => {
    const fetchData = async () => {
      // Fetch events
      setIsLoadingEvents(true);
      try {
        const events = await getAllEvent();
        setCreatedEvents(events || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        setCreatedEvents([]);
      } finally {
        setIsLoadingEvents(false);
      }

      // Fetch photos
      setIsLoadingPhotos(true);
      try {
        const photos = await getAllPhoto();
        setUserPhotos(photos || []);
      } catch (error) {
        console.error("Error fetching photos:", error);
        setUserPhotos([]);
      } finally {
        setIsLoadingPhotos(false);
      }
    };

    fetchData();
  }, []);

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
                  Created ({createdEvents.length})
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
                  Attended (0)
                  {eventsSubTab === "attended" && (
                    <motion.div
                      layoutId="eventsSubTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"
                    />
                  )}
                </button>
              </div>

              {/* Events Content */}
              {isLoadingEvents ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
                </div>
              ) : eventsSubTab === "created" ? (
                createdEvents.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {createdEvents.map((event) => (
                      <EventCard key={event.eventSlug} event={event} />
                    ))}
                  </div>
                ) : (
                  <EmptyState 
                    icon={Calendar}
                    title="No events created yet"
                    description="Start creating memorable events and share them with your friends and family."
                    actionText="Create Event"
                    onAction={() => navigate("/book")}
                  />
                )
              ) : (
                <EmptyState 
                  icon={Users}
                  title="No attended events"
                  description="Events you've attended will appear here."
                />
              )}
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
                  Your Pictures ({userPhotos.length})
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
                  Liked Pictures (0)
                  {picturesSubTab === "liked" && (
                    <motion.div
                      layoutId="picturesSubTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"
                    />
                  )}
                </button>
              </div>

              {/* Pictures Content */}
              {isLoadingPhotos ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
                </div>
              ) : picturesSubTab === "yours" ? (
                userPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {userPhotos.map((picture) => (
                      <PictureCard key={picture.photoId} picture={picture} />
                    ))}
                  </div>
                ) : (
                  <EmptyState 
                    icon={Camera}
                    title="No pictures yet"
                    description="Pictures you've uploaded to events will appear here."
                  />
                )
              ) : (
                <EmptyState 
                  icon={ImageIcon}
                  title="No liked pictures"
                  description="Pictures you've liked will appear here."
                />
              )}
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

// Empty State Component
const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  onAction 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  actionText?: string; 
  onAction?: () => void; 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-full p-6 mb-4">
        <Icon className="w-12 h-12 text-pink-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
        >
          {actionText}
        </motion.button>
      )}
    </motion.div>
  );
};

// Event Card Component
interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={() => navigate(`/gallery?event=${event.eventSlug}`)}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
    >
      <div className="relative aspect-[4/3]">
        <img
          src={event.imageUrl}
          alt={event.eventName}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm mb-1 truncate">{event.eventName}</h3>
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
          <Calendar className="w-3 h-3" />
          <span>{new Date(event.eventDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="w-3 h-3" />
          <span>{event.location}</span>
        </div>
      </div>
    </motion.div>
  );
};

// Picture Card Component
const PictureCard = ({ picture }: { picture: Photo }) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group"
    >
      <div className="relative aspect-square">
        <img
          src={picture.imageUrl}
          alt={`Photo by ${picture.uploader}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      </div>
      <div className="p-2">
        <p className="text-xs font-medium truncate">By {picture.uploader}</p>
        <p className="text-xs text-gray-500">{new Date(picture.uploadedAt).toLocaleDateString()}</p>
      </div>
    </motion.div>
  );
};

export default NewHome;
