import React from "react";

interface PhotoSkeletonProps {
  count?: number;
}

const PhotoSkeleton: React.FC<PhotoSkeletonProps> = ({ count = 8 }) => {
  // Generate random heights for variety (like Pinterest)
  const getRandomHeight = () => {
    const heights = [200, 250, 300, 350, 280, 320];
    return heights[Math.floor(Math.random() * heights.length)];
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="skeleton"
          style={{
            width: "100%",
            height: `${getRandomHeight()}px`,
            borderRadius: "var(--radius-2xl)",
          }}
        />
      ))}
    </>
  );
};

export default PhotoSkeleton;
