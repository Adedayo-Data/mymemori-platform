import { Image } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
  image?: string;
  title: string;
  date: string;
  photoCount: number;
}

const EventCard = ({ image, title, date, photoCount }: EventCardProps) => {
  const navigate = useNavigate();
  const handleViewEvent = (eventTitle: string) => {
    navigate(`/visit/${eventTitle}`);
  };
  // const handleViewEvent = () => {
  //   navigate("/visit");
  // };
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
      {/* Event Images */}
      <div className="grid grid-cols-3 gap-1 p-1">
        <img src={image} alt="BackgroundImage" />
      </div>

      {/* Event Details */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-1 text-lg">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{date}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Image className="w-4 h-4" />
            <span className="text-sm">{photoCount} Photos</span>
          </div>

          <button
            onClick={() => handleViewEvent(title)}
            className="text-pink-600 hover:text-pink-700 font-medium text-sm transition-colors"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
