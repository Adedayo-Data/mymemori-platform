import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import HomeTopNav from "../components/HomeTopNav";
import HomeBottomNav from "../components/HomeBottomNav";
import BentoEventCard, { type EventItem } from "../components/BentoEventCard";
import BentoPictureCard, { type PhotoItem } from "../components/BentoPictureCard";
import JoinEventModal from "../components/JoinEventModal";
import EmptyState from "../components/EmptyState";
import { useEvent } from "../context/eventContext";
import { usePicture } from "../context/pictureContext";
import { useAuth } from "../context/authContext";
import apiClient from "../api/apiClient";

const NewHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { getAllEvent } = useEvent();
  const { getAllPhoto, getLikedPhotos, deletePhoto } = usePicture();

  const [mainTab, setMainTab] = useState<"home" | "events" | "pictures">("home");
  const [eventsSubTab, setEventsSubTab] = useState<"created" | "attended">("created");
  const [picturesSubTab, setPicturesSubTab] = useState<"yours" | "liked">("yours");

  // Modals state
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // Data state
  const [createdEvents, setCreatedEvents] = useState<EventItem[]>([]);
  const [attendedEvents, setAttendedEvents] = useState<EventItem[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  const [userPhotos, setUserPhotos] = useState<PhotoItem[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true);
  const [likedPhotos, setLikedPhotos] = useState<PhotoItem[]>([]);
  const [isLoadingLikedPhotos, setIsLoadingLikedPhotos] = useState(true);

  // Check if we should redirect to profile based on route state
  useEffect(() => {
    if (location.state?.openProfile) {
      navigate("/profile", { replace: true });
    }
  }, [location.state, navigate]);

  // Fetch all events and photos on component load
  useEffect(() => {
    const fetchData = async () => {
      // Fetch created events
      setIsLoadingEvents(true);
      try {
        const events = await getAllEvent();
        setCreatedEvents(events || []);
      } catch (error) {
        console.error("Error fetching created events:", error);
        setCreatedEvents([]);
      }

      // Fetch attended events
      try {
        const response = await apiClient.get("/api/attendance/my-events");
        setAttendedEvents(response.data || []);
      } catch (error) {
        console.error("Error fetching attended events:", error);
        setAttendedEvents([]);
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

      // Fetch liked photos
      setIsLoadingLikedPhotos(true);
      try {
        const liked = await getLikedPhotos();
        setLikedPhotos(liked || []);
      } catch (error) {
        console.error("Error fetching liked photos:", error);
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
      setLikedPhotos((prev) => prev.filter((p) => p.photoId !== photoId));
    } catch (error) {
      console.error("Failed to delete photo:", error);
    }
  };

  return (
    <div className="bg-background text-on-background antialiased min-h-screen pb-28 md:pb-12 relative overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      {/* Ambient Background Glows (Vivid Luminescence) */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-secondary-container/10 blur-[100px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary-container/5 blur-[120px]" />
      </div>

      {/* Top App Bar Navigation */}
      <HomeTopNav
        mainTab={mainTab}
        onTabChange={setMainTab}
        onOpenProfile={() => navigate("/profile")}
        user={user}
      />

      {/* Main Content Canvas */}
      <main className="mt-20 px-container-margin max-w-7xl mx-auto flex flex-col gap-6">
        {/* CTA Banner with Storyteller Greeting (Only visible when user has no events) */}
        {createdEvents.length === 0 && (
          <section
            onClick={() => navigate("/book")}
            className="relative bg-gradient-to-br from-[#b4136d] via-[#f751a1] to-[#6f00be] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_8px_32px_rgba(247,81,161,0.25)] overflow-hidden group cursor-pointer hover:shadow-[0_8px_40px_rgba(247,81,161,0.35)] transition-all duration-300"
          >
            {/* Decorative flare */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-white/20 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="z-10 flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-headline-lg-mobile text-xl md:text-2xl font-bold text-white tracking-tight">
                  Hey, Storyteller
                </h2>
                <span className="inline-block animate-pulse text-[22px]">✨</span>
              </div>
              <p className="font-body-md text-white/90 text-sm md:text-base leading-relaxed">
                Your live celebration stream is currently quiet.
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/book");
              }}
              className="z-10 flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white rounded-full px-5 py-2.5 scale-95 active:scale-90 transition-all duration-200 cursor-pointer shrink-0 font-semibold text-sm shadow-md"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Create Event</span>
            </button>
          </section>
        )}

        {/* Primary Dual-Tab Navigation (Glass Segmented Control) */}
        <section>
          <div className="flex bg-surface-container/40 backdrop-blur-xl rounded-lg p-1 border border-white/10 max-w-sm mx-auto md:mx-0">
            <button
              onClick={() => setMainTab("home")}
              className={`flex-1 py-2 text-center rounded-md font-label-md text-label-md transition-all cursor-pointer ${
                mainTab === "home" || mainTab === "events"
                  ? "bg-white/15 shadow-[0_2px_10px_rgba(0,0,0,0.2)] border border-white/20 text-white font-semibold"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setMainTab("pictures")}
              className={`flex-1 py-2 text-center rounded-md font-label-md text-label-md transition-all cursor-pointer ${
                mainTab === "pictures"
                  ? "bg-white/15 shadow-[0_2px_10px_rgba(0,0,0,0.2)] border border-white/20 text-white font-semibold"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
              }`}
            >
              Pictures
            </button>
          </div>
        </section>

        {/* Tab Content Canvas */}
        <AnimatePresence mode="wait">
          {mainTab === "home" || mainTab === "events" ? (
            <motion.div
              key="events-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              {/* Secondary Sub-tabs */}
              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
                <button
                  onClick={() => setEventsSubTab("created")}
                  className={`px-4 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors cursor-pointer ${
                    eventsSubTab === "created"
                      ? "bg-secondary-container/30 text-secondary-fixed-dim border border-secondary-container/50"
                      : "text-on-surface-variant border border-transparent hover:bg-white/5"
                  }`}
                >
                  Created ({createdEvents.length})
                </button>
                <button
                  onClick={() => setEventsSubTab("attended")}
                  className={`px-4 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors cursor-pointer ${
                    eventsSubTab === "attended"
                      ? "bg-secondary-container/30 text-secondary-fixed-dim border border-secondary-container/50"
                      : "text-on-surface-variant border border-transparent hover:bg-white/5"
                  }`}
                >
                  Attended ({attendedEvents.length})
                </button>
              </div>

              {/* Bento Grid List of Events */}
              {isLoadingEvents ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
                </div>
              ) : eventsSubTab === "created" ? (
                createdEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {createdEvents.map((event) => (
                      <BentoEventCard
                        key={event.eventSlug}
                        event={event}
                        isOwner={true}
                        onDelete={(id) =>
                          setCreatedEvents((prev) =>
                            prev.filter((e) => (e.id || e.eventSlug) !== id)
                          )
                        }
                        onUpdate={(id, newName) =>
                          setCreatedEvents((prev) =>
                            prev.map((e) =>
                              (e.id || e.eventSlug) === id
                                ? { ...e, eventName: newName }
                                : e
                            )
                          )
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon="shutter_speed"
                    title="No Live Celebrations Yet"
                    description="Live guest uploads, shared reactions, and curated story reels will light up your feed once you host or join."
                    actionText="Create Your First Event"
                    onAction={() => navigate("/book")}
                    showJoinButton={true}
                    onJoinAction={() => navigate("/join")}
                  />
                )
              ) : attendedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {attendedEvents.map((event) => (
                    <BentoEventCard key={event.eventSlug} event={event} isOwner={false} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="groups"
                  title="No attended events"
                  description="Events you join with a room code or QR invite will appear here in your celebration stream."
                  actionText="Join with Code or QR"
                  onAction={() => navigate("/join")}
                  showJoinButton={false}
                  />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="pictures-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              {/* Secondary Sub-tabs */}
              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
                <button
                  onClick={() => setPicturesSubTab("yours")}
                  className={`px-4 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors cursor-pointer ${
                    picturesSubTab === "yours"
                      ? "bg-secondary-container/30 text-secondary-fixed-dim border border-secondary-container/50"
                      : "text-on-surface-variant border border-transparent hover:bg-white/5"
                  }`}
                >
                  Your Pictures ({userPhotos.length})
                </button>
                <button
                  onClick={() => setPicturesSubTab("liked")}
                  className={`px-4 py-1.5 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors cursor-pointer ${
                    picturesSubTab === "liked"
                      ? "bg-secondary-container/30 text-secondary-fixed-dim border border-secondary-container/50"
                      : "text-on-surface-variant border border-transparent hover:bg-white/5"
                  }`}
                >
                  Liked Pictures ({likedPhotos.length})
                </button>
              </div>

              {/* Bento Grid List of Pictures */}
              {isLoadingPhotos ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
                </div>
              ) : picturesSubTab === "yours" ? (
                userPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {userPhotos.map((picture) => (
                      <BentoPictureCard
                        key={picture.photoId}
                        picture={picture}
                        onDelete={handleDeletePhoto}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon="photo_camera"
                    title="No pictures yet"
                    description="Pictures you've uploaded to events will appear here in your memory reel."
                    actionText="Create an Event"
                    onAction={() => navigate("/book")}
                    showJoinButton={true}
                    onJoinAction={() => navigate("/join")}
                  />
                )
              ) : isLoadingLikedPhotos ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
                </div>
              ) : likedPhotos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {likedPhotos.map((picture) => (
                    <BentoPictureCard key={picture.photoId} picture={picture} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="favorite"
                  title="No liked pictures"
                  description="Pictures you've liked in active celebration streams will appear here."
                  showJoinButton={false}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Button (Shows only when the top banner is hidden) */}
      {createdEvents.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => navigate("/book")}
          title="Create Event"
          className="fixed bottom-24 right-5 md:bottom-8 md:right-8 w-14 h-14 bg-gradient-to-r from-primary-container via-primary to-secondary text-white rounded-full shadow-[0_8px_24px_rgba(247,81,161,0.4)] hover:shadow-[0_8px_32px_rgba(247,81,161,0.6)] flex items-center justify-center z-40 transition-shadow cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl font-bold">add</span>
        </motion.button>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <HomeBottomNav
        mainTab={mainTab}
        onTabChange={(tab) => {
          if (tab === "events") {
            navigate("/join");
          } else {
            setMainTab(tab);
          }
        }}
        onOpenProfile={() => navigate("/profile")}
        onCreateClick={() => navigate("/book")}
      />

      {/* Join with Code/QR Modal */}
      <JoinEventModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </div>
  );
};

export default NewHome;
