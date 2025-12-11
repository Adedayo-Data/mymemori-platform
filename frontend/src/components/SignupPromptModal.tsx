import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Lock, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SignupPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    returnTo?: string;
}

const SignupPromptModal = ({ isOpen, onClose, returnTo }: SignupPromptModalProps) => {
    const navigate = useNavigate();

    const handleSignup = () => {
        const signupUrl = returnTo
            ? `/auth?mode=signup&returnTo=${encodeURIComponent(returnTo)}`
            : `/auth?mode=signup`;
        navigate(signupUrl);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Container */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-md"
                        >
                            {/* Download Icon "Sticker" - Positioned to overlap paper edge */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                                transition={{
                                    type: "spring",
                                    delay: 0.2,
                                    duration: 0.6,
                                    bounce: 0.5
                                }}
                                className="absolute -top-8 left-1/2 -translate-x-1/2 z-20"
                            >
                                {/* Floating animation for the sticker */}
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                        rotate: [0, 5, -5, 0],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="relative"
                                >
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-2xl opacity-60 animate-pulse" />

                                    {/* Main icon circle */}
                                    <div className="relative bg-gradient-to-br from-pink-500 to-purple-600 rounded-full p-5 shadow-2xl border-4 border-white">
                                        <motion.div
                                            animate={{
                                                y: [0, -3, 0],
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                        >
                                            <Download className="w-8 h-8 text-white" strokeWidth={2.5} />
                                        </motion.div>

                                        {/* Lock badge */}
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.5, type: "spring" }}
                                            className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-lg"
                                        >
                                            <Lock className="w-4 h-4 text-pink-600" />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Paper Cutout Container */}
                            <div
                                className="relative bg-gradient-to-br from-white via-pink-50 to-purple-50 shadow-2xl overflow-hidden"
                                style={{
                                    clipPath: "polygon(5% 0%, 95% 0%, 100% 5%, 100% 80%, 95% 85%, 90% 100%, 10% 100%, 5% 95%, 0% 85%, 0% 5%)",
                                }}
                            >
                                {/* Subtle paper animation */}
                                <motion.div
                                    animate={{
                                        y: [0, -5, 0],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="pt-12 pb-8 px-8"
                                >
                                    {/* Close Button */}
                                    <button
                                        onClick={onClose}
                                        className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all hover:scale-110 z-10"
                                    >
                                        <X className="w-4 h-4 text-gray-600" />
                                    </button>

                                    {/* Floating Sparkles */}
                                    <motion.div
                                        animate={{
                                            y: [0, -15, 0],
                                            rotate: [0, 10, 0],
                                            opacity: [0.4, 0.8, 0.4],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                        className="absolute top-6 left-6 text-pink-400"
                                    >
                                        <Sparkles className="w-5 h-5" />
                                    </motion.div>

                                    <motion.div
                                        animate={{
                                            y: [0, -12, 0],
                                            rotate: [0, -10, 0],
                                            opacity: [0.3, 0.7, 0.3],
                                        }}
                                        transition={{
                                            duration: 3.5,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: 0.5,
                                        }}
                                        className="absolute top-8 right-6 text-purple-400"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                    </motion.div>

                                    <motion.div
                                        animate={{
                                            y: [0, -10, 0],
                                            rotate: [0, 15, 0],
                                            opacity: [0.4, 0.6, 0.4],
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: 1,
                                        }}
                                        className="absolute bottom-16 left-8 text-pink-300"
                                    >
                                        <Sparkles className="w-3 h-3" />
                                    </motion.div>

                                    {/* Title */}
                                    <motion.h2
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-2xl font-bold text-center mb-3 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
                                    >
                                        Save Your Memories Forever
                                    </motion.h2>

                                    {/* Description */}
                                    <motion.p
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-gray-600 text-center mb-6 text-sm leading-relaxed"
                                    >
                                        Sign up to download images and keep your precious moments safe forever!
                                    </motion.p>

                                    {/* CTA Buttons */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="space-y-3"
                                    >
                                        {/* Primary CTA */}
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleSignup}
                                            className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                        >
                                            <Sparkles className="w-4 h-4" />
                                            <span>Sign Up Now</span>
                                        </motion.button>

                                        {/* Secondary CTA */}
                                        <button
                                            onClick={onClose}
                                            className="w-full py-2 px-6 text-gray-600 hover:text-gray-800 font-medium transition-colors text-sm"
                                        >
                                            Maybe Later
                                        </button>
                                    </motion.div>

                                    {/* Benefits List */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="mt-5 pt-5 border-t border-gray-200"
                                    >
                                        <ul className="space-y-2 text-xs text-gray-600">
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600" />
                                                <span>Download unlimited photos</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600" />
                                                <span>Access your memories anytime</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600" />
                                                <span>Share with friends and family</span>
                                            </li>
                                        </ul>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SignupPromptModal;
