import { useState } from "react";
import EventCard from "../components/EventCard";
import { Heart, Plus, Edit, Image, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { LuUser } from "react-icons/lu";
import toast from "react-hot-toast";

const hostedEvents = [
  {
    id: 1,
    title: "Olivia & Liam's Wedding",
    date: "October 18, 2021",
    photoCount: 248,
    images: [{ color: "from-green-100 to-emerald-100" }],
  },
  {
    id: 2,
    title: "The Chen Engagement Party",
    date: "August 15, 2021",
    photoCount: 87,
    images: [{ color: "from-blue-200 to-cyan-200" }],
  },
];

const attendedEvents = [
  {
    id: 3,
    title: "Sarah & Michael's Wedding",
    date: "September 22, 2021",
    photoCount: 156,
  },
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState("hosting");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { getUserDisplayInfo, logout } = useAuth();
  const userInfo = getUserDisplayInfo();

  const handleCreateEvent = () => {
    navigate("/book");
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  //   const handleEditProfile = () => {
  //     console.log("Edit profile");
  //     alert("Opening profile editor...");
  //   };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-rose-50">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>

      {/* Header */}
      <header className="px-6 py-4 relative z-10">
        <div className="max-w-8xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
            <span className="text-xl font-bold text-gray-800">MyMemori</span>
          </div>

          <div className="flex gap-8 ">
            <div className="relative flex items-center gap-3">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-2 bg-orange-100 rounded-full cursor-pointer hover:scale-105"
              >
                <LuUser className="w-6 h-6 text-orange-600" />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-linear-to-r from-pink-500 to-rose-500 rounded-lg shadow-lg border border-gray-200 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-red-400 cursor-pointer rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">
                      Logout
                    </span>
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={handleCreateEvent}
              className="flex items-center gap-2 px-4 py-2  cursor-pointer hover:scale-105 bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              Create New Event
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-8xl px-6 py-8 ">
        {/* Profile Section */}
        <div className="mb-8 border-2 rounded-md bg-white border-gray-300 p-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {userInfo ? userInfo.fullname : "User"}
              </h1>
              <p className="text-gray-500">
                {userInfo ? userInfo.email : "user@example.com"}
              </p>
            </div>

            <button
              //   onClick={handleEditProfile}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg  border  hover:scale-105 "
            >
              <Edit className="w-4 h-4" />
              <span className="text-sm font-medium">Edit Profile</span>
            </button>
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
          <div className="grid md:grid-cols-2 gap-6">
            {hostedEvents.map((event) => (
              <EventCard
                key={event.id}
                image={event.images[0]?.color || ""}
                title={event.title}
                date={event.date}
                photoCount={event.photoCount}
              />
            ))}
          </div>
        )}

        {activeTab === "attended" && (
          <div className="grid md:grid-cols-2 gap-6">
            {attendedEvents.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                date={event.date}
                photoCount={event.photoCount}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
