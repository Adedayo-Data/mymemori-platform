import { useState } from "react";
import Navigation from "../components/Navigation";
import BottomNav from "../components/BottomNav";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useEvent } from "../context/eventContext";
import { usePicture } from "../context/pictureContext";
import { Upload as UploadIcon, X } from "lucide-react";

const Booking = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    location: "",
    description: "",
    allowDownload: false,
    imageUrl: null as string | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [qrCodeValue, setQrCodeValue] = useState("");
  const navigate = useNavigate();
  const { createEvent, loading } = useEvent();
  const { uploadImage } = usePicture();
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      try {
        const imageUrl = await uploadImage(file);
        setFormData((prev) => ({
          ...prev,
          imageUrl: imageUrl, // store the Cloudinary image URL
        }));
      } catch (error) {
        // Error handling is done in the context
        console.error("Upload failed:", error);
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: null,
    }));
    setImagePreview(null);
  };

  const handleCreateEvent = async () => {
    try {
      // Prepare the data to match exactly what the backend expects
      const eventData = {
        eventName: formData.eventName,
        eventDate: formData.eventDate,
        location: formData.location,
        description: formData.description,
        imageUrl: formData.imageUrl
      };

      const eventResponse = await createEvent(eventData);

      // Generate QR code value using the slug from backend response
      const qrValue = `${window.location.origin}/visit/${eventResponse.eventSlug}/`;
      setQrCodeValue(qrValue);
      console.log("Creating event with data:", eventData);
      console.log("Event slug:", eventResponse.eventSlug);

      // Navigate to details page with QR code data
      setTimeout(() => {
        navigate("/share-details", {
          state: {
            qrCodeValue: qrValue,
            eventData: eventData,
            eventSlug: eventResponse.eventSlug,
          },
        });
      }, 6000);
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-rose-50">
      {/* Navigation */}
      <Navigation />

      {/* Decorative elements */}
      <div className="fixed top-20 left-10 w-24 h-24 md:w-32 md:h-32 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="fixed bottom-20 right-10 w-28 h-28 md:w-40 md:h-40 bg-rose-200 rounded-full opacity-20 blur-3xl"></div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Your Wedding Space
          </h1>
          <p className="text-pink-400">
            Fill in the details below to generate a unique QR code for your
            guests
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Event Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Event Details
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                These information will be displayed to your guests
              </p>

              <div className="space-y-5">
                {/* Event Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleInputChange}
                    placeholder="Chidi & Blessing's Wedding"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Event Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="The Grand Ballroom, New York"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Join us as we celebrate our special day!"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Event Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Cover Image (Optional)
                  </label>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Event cover"
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadIcon className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreateEvent}
              disabled={loading}
              className="w-full bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-pink-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Event..." : "Create Event & Get QR Code"}
            </button>
          </div>

          {/* Right Column - Live Preview */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Live Preview
              </h2>

              <div className="bg-linear-to-br from-pink-50 to-rose-50 rounded-2xl p-6 md:p-8 text-center">
                {/* QR Code */}
                <div className="bg-white rounded-xl p-6 mb-4 inline-block shadow-sm">
                  {qrCodeValue ? (
                    <QRCodeSVG
                      value={qrCodeValue}
                      size={220}
                      className="w-full h-full md:w-100 md:h-40"
                    />
                  ) : (
                    <div className="w-full max-w-[220px] h-[220px] bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                      <p className="text-gray-500 text-sm">
                        QR Code will appear here
                      </p>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-500">
                  Scan to mystorypalace.site
                </p>

                <p className="text-xs text-gray-400 mt-4">
                  Powered by MyMemori
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pb-20 md:pb-0">
        <BottomNav />
      </div>
    </div>
  );
};

export default Booking;
