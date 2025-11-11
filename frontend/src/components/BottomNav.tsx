import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Settings, QrCode, PlusCircle, User, X } from "lucide-react";
import { useAuth } from "../context/authContext";

const BottomNav = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white md:hidden">
        <div className="mx-auto grid grid-cols-4 py-2">
          <Link
            to="/profile"
            className={`flex flex-col items-center gap-1 py-2 text-xs font-medium ${
              isActive("/profile")
                ? "text-pink-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>

          <Link
            to="/book"
            className={`flex flex-col items-center gap-1 py-2 text-xs font-medium ${
              isActive("/book")
                ? "text-pink-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create</span>
          </Link>

          <Link
            to="/event-list"
            className={`flex flex-col items-center gap-1 py-2 text-xs font-medium ${
              isActive("/event-list")
                ? "text-pink-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <QrCode className="w-5 h-5" />
            <span>Details</span>
          </Link>

          <button
            type="button"
            className={`flex flex-col items-center gap-1 py-2 text-xs font-medium ${
              isSettingsOpen
                ? "text-pink-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </nav>

      {/* Settings Sidebar */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out bg-white ${
          isSettingsOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="p-2 text-gray-500 rounded-full hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">Account</h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your account settings
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">
                Notifications
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Configure notification preferences
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">Privacy</h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your privacy settings
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900">
                Help & Support
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get help or contact support
              </p>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-gray-200">
            <button
              className="w-full px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-md hover:bg-pink-700"
              onClick={() => logout()}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSettingsOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
          onClick={() => setIsSettingsOpen(false)}
        />
      )}
    </>
  );
};

export default BottomNav;
