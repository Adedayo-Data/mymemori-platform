import React from "react";

interface PhotoSkeletonProps {
  count?: number;
}

const PhotoSkeleton: React.FC<PhotoSkeletonProps> = ({ count = 8 }) => {
  // Generate random heights for variety (like Pinterest)
  const getRandomHeight = () => {
    const heights = [200, 260, 320, 240, 290, 340];
    return heights[Math.floor(Math.random() * heights.length)];
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="w-full bg-white/5 border border-white/5 rounded-xl animate-pulse mb-4"
          style={{
            height: `${getRandomHeight()}px`,
          }}
        />
      ))}
    </>
  );
};

export default PhotoSkeleton;
