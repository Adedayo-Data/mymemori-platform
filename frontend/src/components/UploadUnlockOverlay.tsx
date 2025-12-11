import { motion, AnimatePresence } from "framer-motion";
import { Upload, Lock, Sparkles } from "lucide-react";

interface UploadUnlockOverlayProps {
    photoCount: number; // Not used since we show fixed 10 phantom photos
    onUploadClick: () => void;
}

const UploadUnlockOverlay = ({ onUploadClick }: UploadUnlockOverlayProps) => {
    return (
        <div className="relative">
            {/* Blurred phantom photos grid - creates illusion of more content */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 filter blur-[12px] opacity-50 pointer-events-none">
                {Array.from({ length: 10 }).map((_, index) => (
                    <div
                        key={index}
                        className="aspect-square bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg"
                    />
                ))}
            </div>

            {/* Overlay with unlock message */}
            <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
                    className="relative w-full max-w-md"
                >
                    {/* Paper cutout card */}
                    <div
                        className="relative bg-gradient-to-br from-white via-pink-50 to-rose-50 shadow-2xl overflow-hidden rounded-3xl"
                        style={{
                            clipPath: "polygon(3% 0%, 97% 0%, 100% 3%, 100% 85%, 97% 88%, 92% 100%, 8% 100%, 3% 95%, 0% 88%, 0% 3%)",
                        }}
                    >
                        {/* Floating animation wrapper */}
                        <motion.div
                            animate={{
                                y: [0, -8, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="p-6 sm:p-8"
                        >
                            {/* Lock icon with glow */}
                            <div className="flex justify-center mb-4 sm:mb-6">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full blur-xl opacity-60 animate-pulse" />
                                    <div className="relative bg-gradient-to-br from-pink-500 to-rose-500 rounded-full p-4 sm:p-5 shadow-lg">
                                        <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white" strokeWidth={2.5} />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Floating sparkles */}
                            <motion.div
                                animate={{
                                    y: [0, -10, 0],
                                    opacity: [0.4, 0.8, 0.4],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute top-4 right-4 sm:top-6 sm:right-6 text-pink-400"
                            >
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                            </motion.div>

                            {/* Title */}
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl sm:text-2xl font-bold text-center mb-2 sm:mb-3 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent"
                            >
                                Unlock All Photos
                            </motion.h2>

                            {/* Description */}
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-gray-600 text-center mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed"
                            >
                                Share your photo to see everyone's memories and save them forever. The host can't wait to see your moment!
                            </motion.p>

                            {/* Upload button */}
                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onUploadClick}
                                className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                            >
                                <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>📸 Share My Photo</span>
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default UploadUnlockOverlay;
