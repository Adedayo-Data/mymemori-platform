import { motion, AnimatePresence } from "framer-motion";
import { Upload, X } from "lucide-react";

interface StickyUploadBannerProps {
    isVisible: boolean;
    onUploadClick: () => void;
    onDismiss: () => void;
}

const StickyUploadBanner = ({ isVisible, onUploadClick, onDismiss }: StickyUploadBannerProps) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed left-0 right-0 z-30 px-4"
                    style={{
                        bottom: 'max(6rem, calc(env(safe-area-inset-bottom) + 6rem))',
                        paddingBottom: 'env(safe-area-inset-bottom)'
                    }}
                >
                    <div className="max-w-4xl mx-auto">
                        <div className="relative bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl shadow-2xl shadow-pink-500/50 overflow-hidden">
                            {/* Animated background shimmer */}
                            <motion.div
                                animate={{
                                    x: ["-100%", "100%"],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            />

                            {/* Content */}
                            <div className="relative flex items-center justify-between gap-4 p-4 sm:p-5">
                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-semibold text-sm sm:text-base">
                                        Upload your photo to see all memories & save them forever
                                    </p>
                                </div>

                                {/* Buttons */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {/* Upload button */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={onUploadClick}
                                        className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-pink-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm sm:text-base"
                                    >
                                        <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span className="hidden sm:inline">📸 Share My Photo</span>
                                        <span className="sm:hidden">📸 Share</span>
                                    </motion.button>

                                    {/* Dismiss button */}
                                    <button
                                        onClick={onDismiss}
                                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                        aria-label="Dismiss"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StickyUploadBanner;
