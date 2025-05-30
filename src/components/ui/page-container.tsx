
import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  maxWidth = 'xl',
  className = '' 
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
      {children}
    </div>
  );
};
