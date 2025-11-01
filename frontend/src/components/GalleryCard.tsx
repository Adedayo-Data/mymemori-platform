interface GalleryCardProps {
  image: string;
  title: string;
  date: string;
}

const handleViewGallery = (eventTitle: string) => {
  console.log("Viewing gallery for:", eventTitle);
  alert(`Opening gallery for ${eventTitle}`);
};
const GalleryCard = ({ image, title, date }: GalleryCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
      {/* Event Image Placeholder */}
      <div className="h-48 bg-linear-to-br  flex items-center justify-center text-6xl">
        {image}
      </div>

      {/* Event Details */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-1 text-lg">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{date}</p>

        <button
          onClick={() => handleViewGallery(title)}
          className="w-full bg-pink-50 text-pink-600 font-medium py-2.5 rounded-lg hover:bg-pink-100 transition-all"
        >
          View Gallery
        </button>
      </div>
    </div>
  );
};

export default GalleryCard;
