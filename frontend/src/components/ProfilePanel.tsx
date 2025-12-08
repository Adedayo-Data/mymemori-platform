import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Camera, ChevronDown, ChevronUp, LogOut, Trash2, Lock } from "lucide-react";
import { useAuth } from "../context/authContext";

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfilePanel = ({ isOpen, onClose }: ProfilePanelProps) => {
  const { user, logout } = useAuth();
  const [expandedSection, setExpandedSection] = useState < string | null > ("personal");

  // Form state
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "John Doe",
    email: user?.email || "john@example.com",
    phone: "+1 234 567 8900",
    defaultPrivacy: "public",
    emailNotifications: true,
    pushNotifications: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // TODO: Save to backend
    console.log("Saving profile:", formData);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Slide-in Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Profile
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Profile Header */}
        <div className="px-6 py-8 bg-gradient-to-br from-pink-50 to-purple-50">
          <div className="flex flex-col items-center">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                {formData.fullName.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* User Info */}
            <h3 className="mt-4 text-xl font-bold text-gray-900">{formData.fullName}</h3>
            <p className="text-sm text-gray-500">{formData.email}</p>
            <p className="mt-1 text-xs text-gray-400">Member since Jan 2024</p>
          </div>
        </div>

        {/* Sections */}
        <div className="px-6 py-4 space-y-4">
          {/* Personal Information */}
          <Section
            title="Personal Information"
            icon={<User className="w-5 h-5" />}
            isExpanded={expandedSection === "personal"}
            onToggle={() => toggleSection("personal")}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSave}
                className="w-full px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </Section>

          {/* Your Stats */}
          {/* <Section
            title="Your Stats"
            icon={<span className="text-lg">📊</span>}
            isExpanded={expandedSection === "stats"}
            onToggle={() => toggleSection("stats")}
          >
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Events Created" value="12" />
              <StatCard label="Photos Uploaded" value="234" />
              <StatCard label="Events Attended" value="8" />
              <StatCard label="Total Likes" value="456" />
            </div>
          </Section> */}

          {/* Preferences */}
          {/* <Section
            title="Preferences"
            icon={<Bell className="w-5 h-5" />}
            isExpanded={expandedSection === "preferences"}
            onToggle={() => toggleSection("preferences")}
          >
            <div className="space-y-4">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                  <p className="text-xs text-gray-500">Receive updates via email</p>
                </div>
                <Toggle
                  checked={formData.emailNotifications}
                  onChange={(checked) => handleInputChange("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Push Notifications</p>
                  <p className="text-xs text-gray-500">Receive push notifications</p>
                </div>
                <Toggle
                  checked={formData.pushNotifications}
                  onChange={(checked) => handleInputChange("pushNotifications", checked)}
                />
              </div>
            </div>
          </Section> */}

          {/* Account */}
          <Section
            title="Account"
            icon={<Lock className="w-5 h-5" />}
            isExpanded={expandedSection === "account"}
            onToggle={() => toggleSection("account")}
          >
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </Section>
        </div>
      </motion.div>
    </>
  );
};

// Section Component
const Section = ({
  title,
  icon,
  isExpanded,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-pink-600">{icon}</div>
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-gray-100">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default ProfilePanel;

