import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions<T> {
  items: T[];
  batchSize?: number;
  threshold?: number;
}

interface UseInfiniteScrollReturn<T> {
  displayedItems: T[];
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMore: () => void;
  observerRef: (node: HTMLDivElement | null) => void;
}

export function useInfiniteScroll<T>({
  items,
  batchSize = 20,
  threshold = 0.8,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [displayedCount, setDisplayedCount] = useState(batchSize);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Calculate displayed items
  const displayedItems = items.slice(0, displayedCount);
  
  const hasMore = displayedCount < items.length;

  // Load more items
  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);
    
    // Simulate loading delay for smooth UX
    setTimeout(() => {
      setDisplayedCount(prev => Math.min(prev + batchSize, items.length));
      setIsLoadingMore(false);
    }, 300);
  }, [hasMore, isLoadingMore, batchSize, items.length]);

  // Intersection Observer callback
  const observerCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingMore) return;
      
      // Disconnect previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // Create new observer
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMore();
          }
        },
        { threshold }
      );

      // Observe new node
      if (node) {
        observerRef.current.observe(node);
      }
    },
    [isLoadingMore, hasMore, loadMore, threshold]
  );

  // Reset when items change
  useEffect(() => {
    setDisplayedCount(batchSize);
  }, [items.length, batchSize]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    displayedItems,
    hasMore,
    isLoadingMore,
    loadMore,
    observerRef: observerCallback,
  };
}
