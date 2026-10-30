import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/authContext";
import { useEvent } from "../context/eventContext";
import { usePicture } from "../context/pictureContext";
import ConfirmModal from "../components/ConfirmModal";
import EditNameModal from "../components/EditNameModal";
import HomeBottomNav from "../components/HomeBottomNav";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getAllEvent } = useEvent();
  const { getAllPhoto } = usePicture();

  // State
  const [userName, setUserName] = useState<string>(user?.fullName || "Alex Rivera");
  const [userBio, _setUserBio] = useState<string>("Capturing the magic of every moment. ✨");
  const [eventsCount, setEventsCount] = useState<number>(12);
  const [memoriesCount, setMemoriesCount] = useState<number>(850);
  const [storiesCount] = useState<number>(42);

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Sync user name
  useEffect(() => {
    if (user?.fullName) {
      setUserName(user.fullName);
    }
  }, [user]);

  // Load real stats if available
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const events = await getAllEvent();
        if (events && events.length > 0) {
          setEventsCount(events.length);
        }
      } catch (err) {
        console.warn("Could not fetch events for stats:", err);
      }

      try {
        const photos = await getAllPhoto();
        if (photos && photos.length > 0) {
          setMemoriesCount(photos.length);
        }
      } catch (err) {
        console.warn("Could not fetch photos for stats:", err);
      }
    };

    fetchStats();
  }, [getAllEvent, getAllPhoto]);

  // Handle Edit Profile Save
  const handleSaveName = (newName: string) => {
    setUserName(newName);
    // Update local storage if present
    const rawUserData = localStorage.getItem("userData");
    if (rawUserData) {
      try {
        const parsed = JSON.parse(rawUserData);
        parsed.fullName = newName;
        localStorage.setItem("userData", JSON.stringify(parsed));
      } catch (e) {
        console.error(e);
      }
    }
    toast.success("Profile updated!");
    setIsEditProfileOpen(false);
  };


  // Handle Logout
  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      toast.success("Logged out successfully");
      navigate("/auth");
    }, 400);
  };

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="bg-[#131318] text-[#e4e1e9] font-body-md min-h-screen overflow-x-hidden relative selection:bg-primary/30 selection:text-primary-fixed">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] ambient-glow-primary rounded-full mix-blend-screen opacity-50 blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] ambient-glow-secondary rounded-full mix-blend-screen opacity-40 blur-3xl transform translate-x-1/4 translate-y-1/4" />
      </div>

      {/* TopAppBar */}
      <header className=" hidden md:flex fixed top-0 w-full z-50 bg-[#131318]/80 backdrop-blur-md border-b border-white/10 transition-all duration-200">
        <div className="flex justify-between items-center px-4 sm:px-6 w-full h-16 max-w-7xl mx-auto">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go Back"
            className="text-primary hover:opacity-80 active:scale-95 transition-all duration-200 w-10 h-10 flex items-center justify-center rounded-full glass-panel cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
              arrow_back
            </span>
          </button>
          <h1 className="font-title-md text-lg sm:text-xl text-on-surface font-bold tracking-tight">
            Profile
          </h1>
          <button
            type="button"
            disabled
            aria-label="Settings (Coming Soon)"
            title="Settings coming soon"
            className="text-primary/40 w-10 h-10 flex items-center justify-center rounded-full glass-panel opacity-40 cursor-not-allowed"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
              settings
            </span>
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="relative z-10 pt-[90px] pb-[120px] px-4 md:px-6 max-w-3xl mx-auto flex flex-col gap-6">
        {/* Profile Header Section */}
        <section className="flex flex-col items-center text-center gap-4">
          {/* Avatar with Glowing Border */}
          <div className="relative group">
            <div className="absolute inset-[-4px] rounded-full bg-gradient-vivid opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-300" />
            <div className="w-32 h-32 rounded-full p-[3px] bg-gradient-vivid relative z-10">
              <div className="w-full h-full rounded-full border-4 border-[#131318] bg-[#1f1f25] flex items-center justify-center text-3xl font-bold text-[#ffb0cd] shadow-inner overflow-hidden">
                {initials || "AR"}
              </div>
            </div>
            <button
              type="button"
              disabled
              aria-label="Edit Profile Picture (Coming Soon)"
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#2a292f]/60 border-2 border-[#131318] flex items-center justify-center text-primary/40 z-20 opacity-40 cursor-not-allowed shadow-none"
              title="Avatar upload coming soon"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                edit
              </span>
            </button>
          </div>

          {/* User Info */}
          <div className="flex flex-col gap-1">
            <h2 className="font-headline-lg-mobile text-2xl sm:text-3xl font-bold text-on-surface">
              {userName}
            </h2>
            <p className="font-body-md text-sm sm:text-base text-on-surface-variant max-w-xs mx-auto">
              {userBio}
            </p>
            {user?.email && (
              <span className="text-xs text-[#debec8]/60 mt-0.5">{user.email}</span>
            )}
          </div>

          {/* Action Buttons (Coming Soon) */}
          <div className="flex gap-3 sm:gap-4 w-full mt-2">
            <button
              type="button"
              disabled
              title="Edit Profile coming soon"
              className="flex-1 glass-panel text-on-surface/50 font-label-md text-sm sm:text-base font-semibold py-2.5 px-4 rounded-full border border-white/5 opacity-40 cursor-not-allowed select-none"
            >
              Edit Profile
            </button>
            <button
              type="button"
              disabled
              title="Share Profile coming soon"
              className="flex-1 glass-panel text-on-surface/50 font-label-md text-sm sm:text-base font-semibold py-2.5 px-4 rounded-full border border-white/5 opacity-40 cursor-not-allowed select-none"
            >
              Share Profile
            </button>
          </div>
        </section>

        {/* Stats Row */}
        <section className="glass-panel rounded-2xl p-4 sm:p-5 flex justify-around items-center">
          <div className="flex flex-col items-center text-center">
            <span className="font-title-md text-xl sm:text-2xl font-bold text-on-surface">
              {storiesCount}
            </span>
            <span className="font-label-md text-on-surface-variant text-[12px] tracking-wide uppercase font-semibold">
              Stories
            </span>
          </div>
          <div className="w-[1px] h-10 bg-white/10" />
          <div className="flex flex-col items-center text-center">
            <span className="font-title-md text-xl sm:text-2xl font-bold text-on-surface">
              {eventsCount}
            </span>
            <span className="font-label-md text-on-surface-variant text-[12px] tracking-wide uppercase font-semibold">
              Events
            </span>
          </div>
          <div className="w-[1px] h-10 bg-white/10" />
          <div className="flex flex-col items-center text-center">
            <span className="font-title-md text-xl sm:text-2xl font-bold text-on-surface">
              {memoriesCount}
            </span>
            <span className="font-label-md text-on-surface-variant text-[12px] tracking-wide uppercase font-semibold">
              Memories
            </span>
          </div>
        </section>

        {/* Bento Grid Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* My Achievements (Coming Soon) */}
          <section className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col gap-3 md:col-span-2">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2.5">
                <h3 className="font-title-md text-lg font-bold text-on-surface">
                  My Achievements
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ffb0cd]/10 text-[#ffb0cd] border border-[#ffb0cd]/20 uppercase tracking-wider">
                  Coming Soon
                </span>
              </div>
              <span className="text-[#debec8]/40 font-label-md text-xs font-semibold select-none">
                Season 1
              </span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x no-scrollbar scrollbar-hide opacity-50 select-none pointer-events-none">
              {/* Badge 1 */}
              <div className="min-w-[130px] glass-panel-heavy rounded-2xl p-4 flex flex-col items-center text-center gap-1.5 snap-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/30 mb-1">
                  <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    military_tech
                  </span>
                </div>
                <span className="font-label-md text-on-surface text-[13px] font-bold leading-tight">
                  Gold Storyteller
                </span>
                <span className="text-[11px] text-[#debec8]/60">Top Contributor</span>
              </div>

              {/* Badge 2 */}
              <div className="min-w-[130px] glass-panel-heavy rounded-2xl p-4 flex flex-col items-center text-center gap-1.5 snap-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#ff516a]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 rounded-full bg-[#ff516a]/20 flex items-center justify-center text-tertiary border border-[#ff516a]/30 mb-1">
                  <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    celebration
                  </span>
                </div>
                <span className="font-label-md text-on-surface text-[13px] font-bold leading-tight">
                  Event Guru
                </span>
                <span className="text-[11px] text-[#debec8]/60">10+ Attended</span>
              </div>

              {/* Badge 3 (Locked) */}
              <div className="min-w-[130px] glass-panel rounded-2xl p-4 flex flex-col items-center text-center justify-center gap-1.5 snap-center border-dashed border-white/20 opacity-60">
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center text-on-surface-variant mb-1">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <span className="font-label-md text-on-surface-variant text-[12px] font-medium leading-tight">
                  Next Level
                </span>
                <span className="text-[10px] text-[#debec8]/50">Unlock at 1k</span>
              </div>
            </div>
          </section>

          {/* Memori Plus Banner (Coming Soon) */}
          <section className="relative rounded-2xl p-[2px] overflow-hidden md:col-span-2 opacity-80">
            {/* Animated Gradient Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary animate-gradient-flow" />
            <div className="relative bg-[#1f1f25]/95 h-full rounded-[14px] p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-xl">
              <div className="flex items-start gap-4 w-full">
                <div className="w-12 h-12 rounded-full bg-gradient-vivid flex items-center justify-center text-[#40000d] shrink-0 shadow-[0_0_15px_rgba(247,81,161,0.5)]">
                  <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    workspace_premium
                  </span>
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="font-title-md text-lg font-bold text-on-surface flex items-center gap-2">
                    <span>Memori <span className="text-gradient-vivid font-bold">Plus</span></span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ddb7ff]/10 text-[#ddb7ff] border border-[#ddb7ff]/20 uppercase tracking-wider">
                      Coming Soon
                    </span>
                  </h3>
                  <p className="font-body-md text-on-surface-variant text-sm mt-0.5">
                    Unlock infinite memories &amp; pro tools.
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled
                className="w-full md:w-auto bg-white/5 text-[#debec8]/50 font-label-md text-xs sm:text-sm font-semibold py-2 px-5 rounded-full border border-white/10 opacity-60 cursor-not-allowed whitespace-nowrap"
              >
                Coming Soon
              </button>
            </div>
          </section>

          {/* Account Settings List */}
          <section className="glass-panel rounded-2xl p-4 flex flex-col md:col-span-1">
            <h3 className="font-label-md text-on-surface-variant uppercase tracking-wider px-2 pt-1 pb-2 text-[12px] font-bold">
              Account Settings
            </h3>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => toast("Privacy is set to Friends & Event Attendees")}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-left w-full spring-tap group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#1f1f25] flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors shrink-0">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
                    shield_person
                  </span>
                </div>
                <span className="font-body-md text-sm sm:text-base text-on-surface flex-1 font-medium">
                  Privacy
                </span>
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                  chevron_right
                </span>
              </button>

              <button
                type="button"
                onClick={() => toast("Security settings: 2FA & Password protected")}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-left w-full spring-tap group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#1f1f25] flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors shrink-0">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
                    security
                  </span>
                </div>
                <span className="font-body-md text-sm sm:text-base text-on-surface flex-1 font-medium">
                  Security
                </span>
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                  chevron_right
                </span>
              </button>

              <button
                type="button"
                onClick={() => toast("Notifications enabled")}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-left w-full spring-tap group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#1f1f25] flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors shrink-0">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
                    notifications
                  </span>
                </div>
                <span className="font-body-md text-sm sm:text-base text-on-surface flex-1 font-medium">
                  Notifications
                </span>
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                  chevron_right
                </span>
              </button>
            </div>
          </section>

          {/* Support List */}
          <section className="glass-panel rounded-2xl p-4 flex flex-col md:col-span-1">
            <h3 className="font-label-md text-on-surface-variant uppercase tracking-wider px-2 pt-1 pb-2 text-[12px] font-bold">
              Support &amp; More
            </h3>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => toast("Support team: support@mymemori.app")}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-left w-full spring-tap group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#1f1f25] flex items-center justify-center text-secondary group-hover:bg-secondary/20 transition-colors shrink-0">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
                    help
                  </span>
                </div>
                <span className="font-body-md text-sm sm:text-base text-on-surface flex-1 font-medium">
                  Help &amp; Support
                </span>
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                  chevron_right
                </span>
              </button>

              <button
                type="button"
                onClick={() => toast("MyMemori Platform v2.0 - Cherish every moment.")}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors text-left w-full spring-tap group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#1f1f25] flex items-center justify-center text-secondary group-hover:bg-secondary/20 transition-colors shrink-0">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
                    info
                  </span>
                </div>
                <span className="font-body-md text-sm sm:text-base text-on-surface flex-1 font-medium">
                  About MyMemori
                </span>
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                  chevron_right
                </span>
              </button>
            </div>
          </section>
        </div>

        {/* Log out button */}
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className="text-error font-label-md text-sm sm:text-base font-semibold py-2.5 px-6 rounded-full hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Log Out</span>
          </button>
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <HomeBottomNav
        mainTab="profile"
        onTabChange={(tab) => {
          if (tab === "home") navigate("/home");
          else if (tab === "events") navigate("/join");
          else if (tab === "pictures") navigate("/event-list");
        }}
      />

      {/* Edit Profile Name Modal */}
      <EditNameModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={handleSaveName}
        initialName={userName}
        title="Edit Profile Name"
      />

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Log Out of MyMemori?"
        description="Are you sure you want to log out? You will need to sign in again to manage your events and memories."
        confirmText="Log Out"
        cancelText="Cancel"
        isLoading={isLoggingOut}
        isDestructive={true}
      />
    </div>
  );
};

export default Profile;
