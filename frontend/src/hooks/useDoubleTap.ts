import { useState, useCallback } from 'react';

interface UseDoubleTapOptions {
  onSingleTap?: () => void;
  onDoubleTap?: () => void;
  delay?: number;
}

export const useDoubleTap = ({
  onSingleTap,
  onDoubleTap,
  delay = 300,
}: UseDoubleTapOptions) => {
  const [lastTap, setLastTap] = useState<number>(0);

  const handleTap = useCallback(() => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTap;

    if (timeSinceLastTap < delay && timeSinceLastTap > 0) {
      // Double tap detected
      if (onDoubleTap) {
        onDoubleTap();
      }
      setLastTap(0); // Reset
    } else {
      // Potential single tap
      setLastTap(now);
      
      // Wait to see if there's a second tap
      setTimeout(() => {
        if (Date.now() - now >= delay) {
          if (onSingleTap) {
            onSingleTap();
          }
        }
      }, delay);
    }
  }, [lastTap, delay, onSingleTap, onDoubleTap]);

  return handleTap;
};
