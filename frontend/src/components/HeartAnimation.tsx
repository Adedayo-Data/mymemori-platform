import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface HeartAnimationProps {
    show: boolean;
    onComplete: () => void;
}

/**
 * Instagram-style heart animation that appears when double-tapping
 */
export const HeartAnimation: React.FC<HeartAnimationProps> = ({ show, onComplete }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onComplete, 1000);
            return () => clearTimeout(timer);
        }
    }, [show, onComplete]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    exit={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
                >
                    <Heart
                        className="w-32 h-32 fill-white text-white drop-shadow-2xl"
                        strokeWidth={0}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default HeartAnimation;
