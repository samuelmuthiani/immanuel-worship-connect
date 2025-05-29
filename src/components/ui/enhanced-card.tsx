
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  bordered?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  style?: React.CSSProperties;
}

export function EnhancedCard({ 
  children, 
  className = '', 
  hover = true, 
  gradient = false,
  bordered = false,
  shadow = 'md',
  style
}: EnhancedCardProps) {
  return (
    <Card
      className={cn(
        'transition-all duration-300',
        hover && 'hover:shadow-lg hover:-translate-y-1',
        gradient && 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800',
        bordered && 'border-2 border-iwc-blue/20',
        shadow === 'sm' && 'shadow-sm',
        shadow === 'md' && 'shadow-md',
        shadow === 'lg' && 'shadow-lg',
        shadow === 'xl' && 'shadow-xl',
        className
      )}
      style={style}
    >
      {children}
    </Card>
  );
}

export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
