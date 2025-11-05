import { Image, Edit, Share2, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface EventCardProps {
  image?: string;
  title: string;
  date: string;
  photoCount: number;
  status?: "active" | "ended" | "draft";
  progress?: number;
  lastUpdated?: string;
}

const EventCard = ({
  image,
  title,
  date,
  photoCount,
  status = "active",
  progress = 0,
  lastUpdated,
}: EventCardProps) => {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);

  const handleViewEvent = (eventTitle: string) => {
    navigate(`/visit/${eventTitle}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "ended":
        return "bg-gray-100 text-gray-700";
      case "draft":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Event Image/Gradient Background */}
      <div
        className={`relative h-40 bg-linear-to-br ${
          image || "from-pink-100 to-rose-100"
        } overflow-hidden`}
      >
        {/* Status Badge */}
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
            status
          )}`}
        >
          {getStatusLabel(status)}
        </div>

        {/* Photo Count Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2">
          <Image className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {photoCount}
          </span>
        </div>

        {/* Hover Overlay with Actions */}
        {showActions && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-3 transition-all">
            <button
              onClick={() => handleViewEvent(title)}
              className="p-3 bg-white rounded-full hover:bg-pink-50 transition-colors shadow-lg"
              title="View Event"
            >
              <Eye className="w-5 h-5 text-gray-700" />
            </button>
            <button
              className="p-3 bg-white rounded-full hover:bg-blue-50 transition-colors shadow-lg"
              title="Edit Event"
            >
              <Edit className="w-5 h-5 text-gray-700" />
            </button>
            <button
              className="p-3 bg-white rounded-full hover:bg-green-50 transition-colors shadow-lg"
              title="Share Event"
            >
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
            <button
              className="p-3 bg-white rounded-full hover:bg-red-50 transition-colors shadow-lg"
              title="Delete Event"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>
          </div>
        )}
      </div>

      {/* Event Details */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-1 text-lg line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-3">{date}</p>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600 font-medium">
                Progress
              </span>
              <span className="text-xs text-gray-500">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-pink-500 to-rose-500 transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Last Updated */}
        {lastUpdated && (
          <p className="text-xs text-gray-400 mb-3">Updated {lastUpdated}</p>
        )}

        {/* View Button */}
        <button
          onClick={() => handleViewEvent(title)}
          className="w-full px-4 py-2.5 bg-linear-to-r from-pink-50 to-rose-50 text-pink-600 hover:from-pink-100 hover:to-rose-100 font-medium text-sm rounded-lg transition-all border border-pink-200 hover:border-pink-300"
        >
          View Event
        </button>
      </div>
    </div>
  );
};

export default EventCard;
