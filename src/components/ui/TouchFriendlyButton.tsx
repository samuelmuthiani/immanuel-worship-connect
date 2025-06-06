
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface TouchFriendlyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'touch';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export const TouchFriendlyButton: React.FC<TouchFriendlyButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'default',
  size = 'touch',
  disabled = false,
  loading = false,
  className = '',
  fullWidth = false
}) => {
  const touchSizeClasses = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
    touch: 'h-12 px-6 py-3 text-base sm:h-10 sm:px-4 sm:py-2 sm:text-sm' // Larger on mobile
  };

  return (
    <Button
      type={type}
      variant={variant}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        touchSizeClasses[size],
        fullWidth && 'w-full',
        'touch-manipulation', // Optimizes touch interactions
        className
      )}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};
