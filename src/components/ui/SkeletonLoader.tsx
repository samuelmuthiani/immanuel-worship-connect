
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  variant?: 'card' | 'table' | 'form' | 'profile' | 'list';
  count?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'card',
  count = 1,
  className = ''
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={cn('space-y-4 p-6 border rounded-lg', className)}>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        );
      
      case 'table':
        return (
          <div className={cn('space-y-3', className)}>
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        );
      
      case 'form':
        return (
          <div className={cn('space-y-6', className)}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <Skeleton className="h-10 w-32" />
          </div>
        );
      
      case 'profile':
        return (
          <div className={cn('space-y-6', className)}>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div className={cn('space-y-3', className)}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 border rounded">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        );
      
      default:
        return <Skeleton className={cn('h-4 w-full', className)} />;
    }
  };

  return (
    <div className="animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={count > 1 ? 'mb-6' : ''}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};
