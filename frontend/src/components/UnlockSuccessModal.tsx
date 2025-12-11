import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface UnlockSuccessModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const UnlockSuccessModal = ({ isVisible, onClose }: UnlockSuccessModalProps) => {
    // Auto-dismiss after 2.5 seconds
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, y: 50 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                y: 0,
                                transition: {
                                    type: "spring",
                                    duration: 0.5,
                                    bounce: 0.4
                                }
                            }}
                            exit={{
                                scale: 0.8,
                                opacity: 0,
                                transition: { duration: 0.2 }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative bg-gradient-to-br from-white via-pink-50 to-rose-50 rounded-3xl shadow-2xl overflow-hidden max-w-sm w-full"
                            style={{
                                clipPath: "polygon(3% 0%, 97% 0%, 100% 3%, 100% 85%, 97% 88%, 92% 100%, 8% 100%, 3% 95%, 0% 88%, 0% 3%)",
                            }}
                        >
                            {/* Confetti particles */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                {[...Array(12)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{
                                            y: -20,
                                            x: Math.random() * 100 + "%",
                                            opacity: 1,
                                            rotate: 0
                                        }}
                                        animate={{
                                            y: "120%",
                                            rotate: 360,
                                            opacity: 0,
                                            transition: {
                                                duration: 2 + Math.random(),
                                                delay: Math.random() * 0.3,
                                                ease: "linear"
                                            }
                                        }}
                                        className="absolute w-2 h-2 rounded-full"
                                        style={{
                                            background: ["#ec4899", "#f43f5e", "#f97316", "#fbbf24"][i % 4],
                                            left: `${(i * 8.33)}%`
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Content */}
                            <div className="relative p-8 text-center">
                                {/* Animated Emoji */}
                                <motion.div
                                    animate={{
                                        rotate: [0, -10, 10, -10, 10, 0],
                                        scale: [1, 1.1, 1, 1.1, 1],
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        repeatDelay: 1,
                                    }}
                                    className="text-7xl mb-4"
                                >
                                    🎉
                                </motion.div>

                                {/* Title */}
                                <motion.h2
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-2xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent"
                                >
                                    All Memories Unlocked!
                                </motion.h2>

                                {/* Message */}
                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-gray-600 text-sm"
                                >
                                    Thank you for sharing your moment! 💖
                                </motion.p>

                                {/* Sparkles */}
                                <div className="absolute top-4 right-4">
                                    <motion.span
                                        animate={{
                                            opacity: [0.4, 1, 0.4],
                                            scale: [0.8, 1.2, 0.8],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                        }}
                                        className="text-2xl"
                                    >
                                        ✨
                                    </motion.span>
                                </div>
                                <div className="absolute top-4 left-4">
                                    <motion.span
                                        animate={{
                                            opacity: [0.4, 1, 0.4],
                                            scale: [0.8, 1.2, 0.8],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            delay: 0.5,
                                        }}
                                        className="text-2xl"
                                    >
                                        ✨
                                    </motion.span>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 2.5, ease: "linear" }}
                                className="h-1 bg-gradient-to-r from-pink-500 to-rose-500 origin-left"
                            />
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default UnlockSuccessModal;
