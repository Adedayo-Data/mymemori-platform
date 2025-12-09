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
        // Navigate to signup with return URL
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
                        {/* Modal Container with Paper Cutout Shape */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.8, opacity: 0, rotate: 5 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-md"
                        >
                            {/* Paper Cutout Effect Container */}
                            <div
                                className="relative bg-gradient-to-br from-white via-pink-50 to-purple-50 shadow-2xl overflow-hidden"
                                style={{
                                    clipPath: "polygon(5% 0%, 95% 0%, 100% 5%, 100% 80%, 95% 85%, 90% 100%, 10% 100%, 5% 95%, 0% 85%, 0% 5%)",
                                }}
                            >
                                {/* Floating Animation Wrapper */}
                                <motion.div
                                    animate={{
                                        y: [0, -8, 0],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="p-8 sm:p-10"
                                >
                                    {/* Close Button */}
                                    <button
                                        onClick={onClose}
                                        className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all hover:scale-110"
                                    >
                                        <X className="w-5 h-5 text-gray-600" />
                                    </button>

                                    {/* Icon Animation */}
                                    <div className="flex justify-center mb-6">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2, type: "spring" }}
                                            className="relative"
                                        >
                                            {/* Gradient Circle Background */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse" />

                                            {/* Icon Container */}
                                            <div className="relative bg-gradient-to-br from-pink-500 to-purple-600 rounded-full p-6 shadow-lg">
                                                <motion.div
                                                    animate={{
                                                        rotate: [0, -10, 10, -10, 0],
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity,
                                                        ease: "easeInOut",
                                                    }}
                                                >
                                                    <Download className="w-10 h-10 text-white" />
                                                </motion.div>

                                                {/* Lock Overlay */}
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.5 }}
                                                    className="absolute -bottom-1 -right-1 bg-white rounded-full p-2 shadow-lg"
                                                >
                                                    <Lock className="w-5 h-5 text-pink-600" />
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Sparkles Decoration */}
                                    <div className="absolute top-8 left-8 text-pink-400 opacity-60">
                                        <Sparkles className="w-6 h-6" />
                                    </div>
                                    <div className="absolute bottom-12 right-8 text-purple-400 opacity-60">
                                        <Sparkles className="w-5 h-5" />
                                    </div>

                                    {/* Title */}
                                    <motion.h2
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-2xl sm:text-3xl font-bold text-center mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
                                    >
                                        Save Your Memories Forever
                                    </motion.h2>

                                    {/* Description */}
                                    <motion.p
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-gray-600 text-center mb-8 text-base sm:text-lg leading-relaxed"
                                    >
                                        Sign up to download images and keep your precious moments safe forever.
                                        Join our community and never lose a memory!
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
                                            className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                        >
                                            <Sparkles className="w-5 h-5" />
                                            <span>Sign Up Now</span>
                                        </motion.button>

                                        {/* Secondary CTA */}
                                        <button
                                            onClick={onClose}
                                            className="w-full py-3 px-6 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                                        >
                                            Maybe Later
                                        </button>
                                    </motion.div>

                                    {/* Benefits List */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="mt-6 pt-6 border-t border-gray-200"
                                    >
                                        <ul className="space-y-2 text-sm text-gray-600">
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
