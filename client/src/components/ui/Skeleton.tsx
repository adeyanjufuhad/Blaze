import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#e8e4dd]/70 border border-[#e8e4dd] ${className}`}
    />
  );
};

export const PizzaCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-[#e8e4dd] bg-white overflow-hidden p-4 space-y-4 shadow-xs">
      <Skeleton className="w-full h-52 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="w-3/4 h-6" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-2/3 h-4" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="w-24 h-6" />
        <Skeleton className="w-28 h-10 rounded-xl" />
      </div>
    </div>
  );
};

export default Skeleton;
