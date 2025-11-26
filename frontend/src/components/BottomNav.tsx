import { Link, useLocation } from "react-router-dom";
import { QrCode, PlusCircle, User, Home } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white md:hidden">
      <div className="mx-auto grid grid-cols-4 py-2">
        <Link
          to="/home"
          className={`flex flex-col items-center gap-1 py-2 text-xs font-medium ${
            isActive("/home")
              ? "text-pink-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
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
      </div>
    </nav>
  );
};

export default BottomNav;
