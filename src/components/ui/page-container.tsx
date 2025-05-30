
import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
  title?: string;
  description?: string;
  showBackButton?: boolean;
  backTo?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  maxWidth = 'xl',
  className = '',
  title,
  description,
  showBackButton,
  backTo
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-7xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-none'
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${maxWidthClasses[maxWidth]} ${className}`}>
      {title && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
          {description && (
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
