import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Image as ImageIcon,
  Users,
  MapPin,
  Camera,
  Plus,
  Download,
  Trash2,
  MoreVertical,
  Edit2,
} from "lucide-react";
import ProfilePanel from "../components/ProfilePanel";
import ConfirmModal from "../components/ConfirmModal";
import EditNameModal from "../components/EditNameModal";
import { useEvent } from "../context/eventContext";
import { usePicture } from "../context/pictureContext";
import apiClient from "../api/apiClient";

interface Event {
  eventName?: string;
  eventDate?: string;
  location?: string;
  description?: string;
  eventSlug: string;
  imageUrl?: string;
  photoCount?: number;
  id?: string | number;
  [key: string]: string | number | undefined;
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
  const { getAllEvent } = useEvent();
  const { getAllPhoto, getLikedPhotos, deletePhoto } = usePicture();
  const location = useLocation();
  const [mainTab, setMainTab] = useState<"events" | "pictures">("events");
  const [eventsSubTab, setEventsSubTab] = useState<"created" | "attended">(
    "created"
  );
  const [picturesSubTab, setPicturesSubTab] = useState<"yours" | "liked">(
    "yours"
  );
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [attendedEvents, setAttendedEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [userPhotos, setUserPhotos] = useState<Photo[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
  const [likedPhotos, setLikedPhotos] = useState<Photo[]>([]);
  const [isLoadingLikedPhotos, setIsLoadingLikedPhotos] = useState(true);

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
      // Fetch created events
      setIsLoadingEvents(true);
      try {
        const events = await getAllEvent();
        setCreatedEvents(events || []);
      } catch {
        setCreatedEvents([]);
      }

      // Fetch attended events
      try {
        const response = await apiClient.get("/api/attendance/my-events");
        setAttendedEvents(response.data || []);
      } catch {
        setAttendedEvents([]);
      } finally {
        setIsLoadingEvents(false);
      }

      // Fetch photos
      setIsLoadingPhotos(true);
      try {
        const photos = await getAllPhoto();
        setUserPhotos(photos || []);
      } catch {
        setUserPhotos([]);
      } finally {
        setIsLoadingPhotos(false);
      }

      // Fetch liked photos
      setIsLoadingLikedPhotos(true);
      try {
        const liked = await getLikedPhotos();
        setLikedPhotos(liked || []);
      } catch {
        setLikedPhotos([]);
      } finally {
        setIsLoadingLikedPhotos(false);
      }
    };

    fetchData();
  }, [getAllEvent, getAllPhoto, getLikedPhotos]);

  const handleDeletePhoto = async (photoId: string) => {
    try {
      await deletePhoto(photoId);
      setUserPhotos((prev) => prev.filter((p) => p.photoId !== photoId));
    } catch (error) {
      console.error("Failed to delete photo:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Title */}
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              MyMemori
            </h1>

            {/* Main Tabs - Inline with title */}
            <div className="flex">
              <button
                onClick={() => setMainTab("events")}
                className={`relative py-2 px-4 font-medium text-sm transition-all rounded-lg ${mainTab === "events"
                  ? "text-pink-600 bg-pink-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Events </span>
                </div>
              </button>

              <button
                onClick={() => setMainTab("pictures")}
                className={`relative py-2 px-4 font-medium text-sm transition-all rounded-lg ${mainTab === "pictures"
                  ? "text-pink-600 bg-pink-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  <span>Pictures </span>
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
                  className={`relative pb-3 px-1 font-medium text-sm transition-colors ${eventsSubTab === "created"
                    ? "text-pink-600"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Created({createdEvents.length})
                  {eventsSubTab === "created" && (
                    <motion.div
                      layoutId="eventsSubTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"
                    />
                  )}
                </button>

                <button
                  onClick={() => setEventsSubTab("attended")}
                  className={`relative pb-3 px-1 font-medium text-sm transition-colors ${eventsSubTab === "attended"
                    ? "text-pink-600"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Attended({attendedEvents.length})
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
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600">
                    {" "}
                  </div>
                </div>
              ) : eventsSubTab === "created" ? (
                createdEvents.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {createdEvents.map((event) => (
                      <EventCard 
                        key={event.eventSlug} 
                        event={event} 
                        isOwner={true} 
                        onDelete={(id) => setCreatedEvents(prev => prev.filter(e => (e.id || e.eventSlug) !== id))}
                        onUpdate={(id, newName) => setCreatedEvents(prev => prev.map(e => (e.id || e.eventSlug) === id ? { ...e, eventName: newName } : e))}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Calendar}
                    title="No events created yet"
                    description="Start creating memorable events and share them with your friends and family."
                  />
                )
              ) : attendedEvents.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {attendedEvents.map((event) => (
                    <EventCard key={event.eventSlug} event={event} isOwner={false} />
                  ))}
                </div>
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
                  className={`relative pb-3 px-1 font-medium text-sm transition-colors ${picturesSubTab === "yours"
                    ? "text-pink-600"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Your Pictures({userPhotos.length})
                  {picturesSubTab === "yours" && (
                    <motion.div
                      layoutId="picturesSubTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"
                    />
                  )}
                </button>

                <button
                  onClick={() => setPicturesSubTab("liked")}
                  className={`relative pb-3 px-1 font-medium text-sm transition-colors ${picturesSubTab === "liked"
                    ? "text-pink-600"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Liked Pictures({likedPhotos.length})
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
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600">
                    {" "}
                  </div>
                </div>
              ) : picturesSubTab === "yours" ? (
                userPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {userPhotos.map((picture) => (
                      <PictureCard key={picture.photoId} picture={picture} onDelete={handleDeletePhoto} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Camera}
                    title="No pictures yet"
                    description="Pictures you've uploaded to events will appear here."
                  />
                )
              ) : isLoadingLikedPhotos ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600">
                    {" "}
                  </div>
                </div>
              ) : likedPhotos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {likedPhotos.map((picture) => (
                    <PictureCard key={picture.photoId} picture={picture} />
                  ))}
                </div>
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
      <ProfilePanel
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
};

// Empty State Component
const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
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
      <h3 className="text-xl font-semibold text-gray-900 mb-2"> {title} </h3>
      <p className="text-gray-500 text-center max-w-md mb-6"> {description} </p>
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
  isOwner?: boolean;
  onUpdate?: (id: string | number, newName: string) => void;
  onDelete?: (id: string | number) => void;
}

const EventCard = ({ event, isOwner = false, onUpdate, onDelete }: EventCardProps) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { updateEvent, deleteEvent } = useEvent();
  
  const eventId = event.id || event.eventSlug;

  const handleDelete = async () => {
    if (!eventId) return;
    try {
      await deleteEvent(eventId);
      setShowDeleteConfirm(false);
      if (onDelete) onDelete(eventId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (newName: string) => {
    if (!eventId) return;
    try {
      await updateEvent(eventId, {
        eventName: newName,
        eventDate: event.eventDate,
        location: event.location,
        description: event.description,
        imageUrl: event.imageUrl
      });
      setShowEditModal(false);
      if (onUpdate) onUpdate(eventId, newName);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        onClick={() => {
          if (!showMenu) navigate(`/gallery?event=${event.eventSlug}`);
        }}
        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer relative"
      >
        <div className="relative aspect-[4/3]">
          <img
            src={event.imageUrl}
            alt={event.eventName}
            className="w-full h-full object-cover"
          />
          
          {/* Action Menu (Top Right) */}
          {isOwner && (
            <div className="absolute top-2 right-2 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full text-white transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-30"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                      }}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-40 py-1 origin-top-right"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMenu(false);
                          setShowEditModal(true);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Name
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMenu(false);
                          setShowDeleteConfirm(true);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Event
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Photo count badge (Moved to bottom left so it doesn't overlap) */}
          {event.photoCount !== undefined && event.photoCount > 0 && (
            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold z-10">
              <ImageIcon className="w-3 h-3" />
              <span>{event.photoCount}</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm mb-1 truncate">
            {event.eventName}
          </h3>
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
            <Calendar className="w-3 h-3" />
            <span>
              {event.eventDate
                ? new Date(event.eventDate).toLocaleDateString()
                : "TBD"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            <span>{event.location}</span>
          </div>
        </div>
      </motion.div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Event"
        description={`Are you sure you want to delete "${event.eventName}"? This will permanently remove the event and all its photos.`}
        confirmText="Delete Event"
        isDestructive={true}
      />

      <EditNameModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEdit}
        initialName={event.eventName || ""}
        title="Edit Event Name"
      />
    </>
  );
};

// Picture Card Component
const PictureCard = ({ picture, onDelete }: { picture: Photo, onDelete?: (id: string) => void }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(picture.imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `photo-${picture.photoId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
      window.open(picture.imageUrl, '_blank');
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDelete || isDeleting) return;
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(picture.photoId);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group relative"
      >
        <div className="relative aspect-square">
          <img
            src={picture.imageUrl}
            alt={`Photo by ${picture.uploader}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />

          {/* Actions Overlay */}
          <div className="absolute bottom-2 left-2 flex flex-row gap-25 z-10">
            <button
              onClick={handleDownload}
              className="p-1.5 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full text-white transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>

            {onDelete && (
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="p-1.5 bg-red-500/80 hover:bg-red-600 backdrop-blur-sm rounded-full text-white transition-colors disabled:opacity-50"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Picture"
        description="Are you sure you want to delete this picture? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </>
  );
};

export default NewHome;
