
import React from 'react';
import { toast as sonnerToast } from 'sonner';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface MobileToastOptions {
  title?: string;
  description: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useMobileToast = () => {
  const { toast } = useToast();

  const showToast = ({
    title,
    description,
    type = 'info',
    duration = 5000,
    action
  }: MobileToastOptions) => {
    const icons = {
      success: <CheckCircle className="h-4 w-4" />,
      error: <AlertCircle className="h-4 w-4" />,
      info: <Info className="h-4 w-4" />,
      warning: <AlertCircle className="h-4 w-4" />
    };

    const variants = {
      success: 'default',
      error: 'destructive',
      info: 'default',
      warning: 'default'
    } as const;

    // Use native toast for better mobile experience
    if ('serviceWorker' in navigator && window.innerWidth < 768) {
      sonnerToast(description, {
        icon: icons[type],
        duration,
        action: action ? {
          label: action.label,
          onClick: action.onClick
        } : undefined,
        position: 'top-center',
        className: 'mobile-toast',
        style: {
          maxWidth: '90vw',
          fontSize: '14px'
        }
      });
    } else {
      toast({
        title,
        description,
        variant: variants[type],
        duration,
        action: action ? (
          <button
            onClick={action.onClick}
            className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            {action.label}
          </button>
        ) : undefined
      });
    }
  };

  return { showToast };
};

// Enhanced toast utilities
export const mobileToast = {
  success: (message: string, options?: Partial<MobileToastOptions>) =>
    useMobileToast().showToast({ description: message, type: 'success', ...options }),
  
  error: (message: string, options?: Partial<MobileToastOptions>) =>
    useMobileToast().showToast({ description: message, type: 'error', ...options }),
  
  info: (message: string, options?: Partial<MobileToastOptions>) =>
    useMobileToast().showToast({ description: message, type: 'info', ...options }),
  
  warning: (message: string, options?: Partial<MobileToastOptions>) =>
    useMobileToast().showToast({ description: message, type: 'warning', ...options })
};
