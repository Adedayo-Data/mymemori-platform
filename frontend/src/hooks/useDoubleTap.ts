import { useState, useCallback, useRef } from 'react';

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
  const timeoutRef = useRef<number | null>(null);

  const handleTap = useCallback(() => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTap;

    if (timeSinceLastTap < delay && timeSinceLastTap > 0) {
      // Double tap detected
      // CRITICAL: Clear the pending single-tap timeout to prevent it from firing
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      if (onDoubleTap) {
        onDoubleTap();
      }
      setLastTap(0); // Reset
    } else {
      // Potential single tap
      setLastTap(now);
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Wait to see if there's a second tap
      timeoutRef.current = setTimeout(() => {
        if (Date.now() - now >= delay) {
          if (onSingleTap) {
            onSingleTap();
          }
        }
        timeoutRef.current = null;
      }, delay);
    }
  }, [lastTap, delay, onSingleTap, onDoubleTap]);

  return handleTap;
};
