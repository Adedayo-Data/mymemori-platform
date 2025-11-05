import { useState } from "react";
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useEvent } from "../context/eventContext";
import { Upload as UploadIcon, X } from "lucide-react";
import toast from "react-hot-toast";

const Booking = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    location: "",
    description: "",
    allowDownload: false,
    eventImage: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [qrCodeValue, setQrCodeValue] = useState("");
  const navigate = useNavigate();
  const { createEvent, loading } = useEvent();
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let checked = false;
    if ("checked" in e.target) {
      checked = e.target.checked;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        eventImage: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success("Image uploaded successfully!");
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      eventImage: null,
    }));
    setImagePreview(null);
  };

  const handleCreateEvent = async () => {
    try {
      const eventResponse = await createEvent(formData);

      // Generate QR code value using the slug from backend response
      const qrValue = `${window.location.origin}/visit/${eventResponse.eventSlug}/`;
      setQrCodeValue(qrValue);
      console.log("Creating event with data:", formData);
      console.log("Event slug:", eventResponse.eventSlug);

      // Navigate to details page with QR code data
      navigate("/details", {
        state: {
          qrCodeValue: qrValue,
          eventData: formData,
          eventSlug: eventResponse.eventSlug, // not .slug
        },
      });
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Navigation */}
      <Navigation />

      {/* Decorative elements */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="fixed bottom-20 right-10 w-40 h-40 bg-rose-200 rounded-full opacity-20 blur-3xl"></div>

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

            {/* Privacy Settings Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Privacy Settings
              </h2>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">
                  Allow guests to download photos
                </span>
                <button
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      allowDownload: !prev.allowDownload,
                    }))
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    formData.allowDownload ? "bg-pink-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      formData.allowDownload ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
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

              <div className="bg-linear-to-br from-pink-50 to-rose-50 rounded-2xl p-8 text-center">
                {/* QR Code */}
                <div className="bg-white rounded-xl p-6 mb-4 inline-block shadow-sm">
                  {qrCodeValue ? (
                    <QRCodeSVG value={qrCodeValue} size={270} />
                  ) : (
                    <div className="w-70 h-70 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">QR Code will appear here</p>
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
    </div>
  );
};

export default Booking;
