
import React from 'react';
import { BackButton } from '@/components/ui/back-button';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showBackButton?: boolean;
  backTo?: string;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function PageContainer({
  children,
  title,
  description,
  showBackButton = false,
  backTo,
  className = '',
  maxWidth = 'xl'
}: PageContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    full: 'max-w-full'
  };

  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors', className)}>
      <div className={cn('mx-auto', maxWidthClasses[maxWidth])}>
        {showBackButton && <BackButton to={backTo} />}
        
        {(title || description) && (
          <div className="mb-8 text-center">
            {title && (
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-lg text-gray-600 dark:text-gray-300 animate-fade-in">
                {description}
              </p>
            )}
          </div>
        )}
        
        <div className="animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
}
