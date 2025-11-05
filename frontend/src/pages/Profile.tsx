import { useState } from "react";
import Navigation from "../components/Navigation";
import EventCard from "../components/EventCard";
import {
  Heart,
  Plus,
  Edit,
  Image,
  Camera,
  Users,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";

const hostedEvents = [
  {
    id: 1,
    title: "Olivia & Liam's Wedding",
    date: "October 18, 2021",
    photoCount: 248,
    images: [{ color: "from-green-100 to-emerald-100" }],
    status: "ended" as const,
    progress: 100,
    lastUpdated: "2 days ago",
  },
  {
    id: 2,
    title: "The Chen Engagement Party",
    date: "August 15, 2021",
    photoCount: 87,
    images: [{ color: "from-blue-200 to-cyan-200" }],
    status: "active" as const,
    progress: 65,
    lastUpdated: "1 hour ago",
  },
];

const attendedEvents = [
  {
    id: 3,
    title: "Sarah & Michael's Wedding",
    date: "September 22, 2021",
    photoCount: 156,
    status: "ended" as const,
    progress: 100,
  },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("hosting");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();
  const { getUserDisplayInfo } = useAuth();
  const userInfo = getUserDisplayInfo();

  const handleCreateEvent = () => {
    navigate("/book");
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const profileCompletion = 75; // Example: 75% complete

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-rose-50">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Profile Header */}
        <div className="mb-8 bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* User Info */}
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-linear-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl font-bold text-white">
                  {userInfo?.fullname?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>

              {/* User Details */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {userInfo?.fullname || "User"}
                </h1>
                <p className="text-gray-500 mb-3">
                  {userInfo?.email || "user@example.com"}
                </p>

                {/* Profile Completion */}
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-pink-500 to-rose-500 transition-all"
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-gray-600">
                    {profileCompletion}% Complete
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={handleEditProfile}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 font-medium transition-all"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
              <button
                onClick={handleCreateEvent}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 rounded-lg font-medium transition-all shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Create Event
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Events Hosted
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {hostedEvents.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Total Photos
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {hostedEvents.reduce((sum, e) => sum + e.photoCount, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Guests Invited
                </p>
                <p className="text-3xl font-bold text-gray-900">128</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("hosting")}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === "hosting"
                ? "text-pink-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Heart
                className={`w-4 h-4 ${
                  activeTab === "hosting" ? "fill-pink-600" : ""
                }`}
              />
              Events I'm Hosting
            </div>
            {activeTab === "hosting" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"></div>
            )}
          </button>

          <button
            onClick={() => setActiveTab("attended")}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === "attended"
                ? "text-pink-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Events I've Attended
            </div>
            {activeTab === "attended" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600"></div>
            )}
          </button>
        </div>

        {/* Events Grid */}
        {activeTab === "hosting" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostedEvents.map((event) => (
              <div key={event.id}>
                <EventCard
                  image={event.images[0]?.color || ""}
                  title={event.title}
                  date={event.date}
                  photoCount={event.photoCount}
                  status={event.status}
                  progress={event.progress}
                  lastUpdated={event.lastUpdated}
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === "attended" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attendedEvents.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                date={event.date}
                photoCount={event.photoCount}
                status={event.status}
                progress={event.progress}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Edit Profile
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue={userInfo?.fullname}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={userInfo?.email}
                  disabled
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success("Profile updated successfully!");
                  setIsEditModalOpen(false);
                }}
                className="flex-1 px-4 py-2.5 bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 font-medium transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
