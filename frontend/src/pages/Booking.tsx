import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEvent } from "../context/eventContext";
import { usePicture } from "../context/pictureContext";
import { Upload as UploadIcon, X, Calendar, MapPin, Image as ImageIcon, Sparkles, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { formatEventDate } from "../utils/dateUtils";

const Booking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    location: "",
    description: "",
    imageUrl: "" as string | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { createEvent, loading: isEventLoading } = useEvent();
  const { uploadEventImage, loading: isImageLoading } = usePicture();
  const loading = isEventLoading || isImageLoading;

  const totalSteps = 4;

  // Auto-save to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("bookingDraft");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(parsed.formData);
      setImagePreview(parsed.imagePreview);
      setCurrentStep(parsed.currentStep || 1);
    }
  }, []);

  useEffect(() => {
    const draft = {
      formData,
      imagePreview,
      currentStep,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("bookingDraft", JSON.stringify(draft));
  }, [formData, imagePreview, currentStep]);

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      try {
        const imageUrl = await uploadEventImage(file);
        setFormData((prev) => ({
          ...prev,
          imageUrl: imageUrl,
        }));
      } catch (error) {
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

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1 && !formData.eventName.trim()) {
      toast.error("Please enter an event name");
      return;
    }
    if (currentStep === 2 && !formData.eventDate) {
      toast.error("Please select a date");
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateEvent = async () => {
    try {
      const eventData = {
        eventName: formData.eventName,
        eventDate: formData.eventDate,
        location: formData.location,
        description: formData.description,
        imageUrl: formData.imageUrl,
      };

      const eventResponse = await createEvent(eventData);
      toast.success("Event created successfully!");
      
      const qrValue = `${window.location.origin}/visit/${eventResponse.eventSlug}/`;

      // Clear draft
      localStorage.removeItem("bookingDraft");

      // Navigate to details page
      setTimeout(() => {
        navigate("/share-details", {
          state: {
            qrCodeValue: qrValue,
            eventData: eventData,
            eventSlug: eventResponse.eventSlug,
          },
        });
      }, 2000);
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-rose-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="fixed top-20 left-10 w-24 h-24 md:w-32 md:h-32 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="fixed bottom-20 right-10 w-28 h-28 md:w-40 md:h-40 bg-rose-200 rounded-full opacity-20 blur-3xl"></div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-pink-600">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-linear-to-r from-pink-500 to-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Visual Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`visual-${currentStep}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="hidden lg:block relative"
            >
              {/* Step 1 Visual */}
              {currentStep === 1 && (
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-br from-pink-100 to-rose-100 rounded-3xl blur-3xl opacity-50"></div>
                  <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl p-12 border border-pink-200">
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        y: [0, -10, 0]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-center"
                    >
                      <div className="text-8xl mb-6">🎉</div>
                      <div className="space-y-3">
                        <div className="h-4 bg-pink-200 rounded-full w-3/4 mx-auto"></div>
                        <div className="h-4 bg-rose-200 rounded-full w-1/2 mx-auto"></div>
                        <div className="h-4 bg-pink-200 rounded-full w-2/3 mx-auto"></div>
                      </div>
                    </motion.div>
                    <div className="mt-8 grid grid-cols-3 gap-3">
                      <motion.div 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                        className="h-16 bg-linear-to-br from-pink-200 to-pink-300 rounded-xl"
                      ></motion.div>
                      <motion.div 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                        className="h-16 bg-linear-to-br from-rose-200 to-rose-300 rounded-xl"
                      ></motion.div>
                      <motion.div 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                        className="h-16 bg-linear-to-br from-pink-200 to-pink-300 rounded-xl"
                      ></motion.div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 Visual */}
              {currentStep === 2 && (
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-br from-blue-100 to-purple-100 rounded-3xl blur-3xl opacity-50"></div>
                  <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl p-12 border border-blue-200">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-center"
                    >
                      <div className="text-8xl mb-6">📅</div>
                      <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="grid grid-cols-7 gap-2 mb-4">
                          {[...Array(7)].map((_, i) => (
                            <div key={i} className="h-8 bg-gray-100 rounded"></div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                          {[...Array(14)].map((_, i) => (
                            <motion.div
                              key={i}
                              animate={{ 
                                backgroundColor: i === 9 ? ['#dbeafe', '#3b82f6', '#dbeafe'] : '#f3f4f6'
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="h-8 rounded"
                            ></motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Step 3 Visual */}
              {currentStep === 3 && (
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-br from-purple-100 to-pink-100 rounded-3xl blur-3xl opacity-50"></div>
                  <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl p-12 border border-purple-200">
                    <div className="text-center">
                      <div className="text-8xl mb-6">🖼️</div>
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          animate={{ 
                            rotate: [0, -2, 0],
                            y: [0, -5, 0]
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="aspect-square bg-linear-to-br from-purple-200 to-purple-300 rounded-2xl shadow-lg"
                        ></motion.div>
                        <motion.div
                          animate={{ 
                            rotate: [0, 2, 0],
                            y: [0, -5, 0]
                          }}
                          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                          className="aspect-square bg-linear-to-br from-pink-200 to-pink-300 rounded-2xl shadow-lg"
                        ></motion.div>
                      </div>
                      <div className="mt-6 space-y-2">
                        <div className="h-3 bg-purple-200 rounded-full w-full"></div>
                        <div className="h-3 bg-pink-200 rounded-full w-4/5"></div>
                        <div className="h-3 bg-purple-200 rounded-full w-3/5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Right Side - Form Content */}
          <AnimatePresence mode="wait">
            {/* Step 1: Event Name */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-pink-500 to-rose-500 rounded-full mb-4"
                  >
                    <Sparkles className="w-8 h-8 text-white" />
                  </motion.div>
                  <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                    Let's Start Your Story
                  </h1>
                  <p className="text-lg text-gray-600">
                    Every great memory starts with a name...
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What's the occasion?
                  </label>
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleInputChange}
                    placeholder="Sarah & Michael's Wedding"
                    className="w-full px-6 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    autoFocus
                  />
                  <p className="text-sm text-gray-500 mt-3">
                    This will be the first thing your guests see
                  </p>
                </div>

                <div className="flex justify-end mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="px-8 py-4 bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )}

          {/* Step 2: Date & Location */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-purple-500 rounded-full mb-4"
                >
                  <Calendar className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                  When & Where
                </h1>
                <p className="text-lg text-gray-600">
                  Your story is taking shape...
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Location <span className="text-gray-400">(Optional)</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="The Grand Ballroom, New York"
                      className="w-full pl-12 pr-6 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="px-8 py-4 bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Image & Description */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-full mb-4"
                >
                  <ImageIcon className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                  Set the Scene
                </h1>
                <p className="text-lg text-gray-600">
                  A picture is worth a thousand memories
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Event Cover Image <span className="text-gray-400">(Optional)</span>
                  </label>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Event cover"
                        className="w-full h-64 object-cover rounded-xl"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadIcon className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600 font-medium">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Description <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Join us as we celebrate our special day!"
                    rows={4}
                    className="w-full px-6 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {formData.description.length} / 500 characters
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="px-8 py-4 bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review & Create */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-green-500 to-emerald-500 rounded-full mb-4"
                >
                  <Check className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                  Almost There!
                </h1>
                <p className="text-lg text-gray-600">
                  Review your event details before creating
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Event Name
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {formData.eventName}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Date
                    </label>
                    <p className="text-lg font-semibold text-gray-900">
                      {formData.eventDate
                        ? formatEventDate(formData.eventDate)
                        : "Not set"}
                    </p>
                  </div>

                  {formData.location && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Location
                      </label>
                      <p className="text-lg font-semibold text-gray-900">
                        {formData.location}
                      </p>
                    </div>
                  )}

                  {formData.description && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Description
                      </label>
                      <p className="text-gray-900">{formData.description}</p>
                    </div>
                  )}

                  {imagePreview && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Cover Image
                      </label>
                      <img
                        src={imagePreview}
                        alt="Event cover"
                        className="w-full h-48 object-cover rounded-xl"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreateEvent}
                  disabled={loading}
                  className="px-8 py-4 bg-linear-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Event
                      <Sparkles className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Booking;
