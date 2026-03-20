'use client';

export default function LoadingSkeleton({ count = 4 }) {
  return (
    <div className="flex flex-wrap w-full justify-center">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-300 animate-pulse rounded-ios h-28 w-full sm:w-1/2 lg:w-1/4 m-2"
        />
      ))}
    </div>
  );
}
