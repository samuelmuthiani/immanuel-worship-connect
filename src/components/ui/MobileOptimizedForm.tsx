
import React from 'react';
import { cn } from '@/lib/utils';

interface MobileOptimizedFormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
  spacing?: 'tight' | 'normal' | 'loose';
}

export const MobileOptimizedForm: React.FC<MobileOptimizedFormProps> = ({
  children,
  onSubmit,
  className = '',
  spacing = 'normal'
}) => {
  const spacingClasses = {
    tight: 'space-y-3',
    normal: 'space-y-4 sm:space-y-6',
    loose: 'space-y-6 sm:space-y-8'
  };

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        'w-full',
        spacingClasses[spacing],
        className
      )}
    >
      {children}
    </form>
  );
};
