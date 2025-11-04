import { useState } from "react";
import { LuHeart, LuUser } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useEvent } from "../context/eventContext";

const Booking = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    location: "",
    description: "",
    allowDownload: false,
  });
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

  const handleCreateEvent = async () => {
    try {
      const eventResponse = await createEvent(formData);

      // Generate QR code value using the slug from backend response
      const qrValue = `https://localhost:5173/e/${eventResponse.eventSlug}`;
      setQrCodeValue(qrValue);
      console.log("Creating event with data:", formData);
      console.log("Event slug:", eventResponse.slug);

      // Navigate to details page with QR code data
      navigate("/details", {
        state: {
          qrCodeValue: qrValue,
          eventData: formData,
          eventSlug: eventResponse.slug,
        },
      });
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LuHeart className="w-6 h-6 text-pink-500 fill-pink-500" />
            <span className="text-xl font-bold text-gray-800">MyMemori</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="p-2 bg-orange-100 rounded-full"
              onClick={() => navigate("/profile")}
            >
              <LuUser className="w-5 h-5 text-orange-600" />
            </button>
            <p>Profile</p>
          </div>
        </div>
      </header>

      {/* Decorative elements */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="fixed bottom-20 right-10 w-40 h-40 bg-rose-200 rounded-full opacity-20 blur-3xl"></div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
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
                  <p className="text-xs text-gray-400 mt-1.5">
                    This will show the names of the guests
                  </p>
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
