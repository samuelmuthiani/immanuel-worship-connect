
import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showPasswordToggle?: boolean;
}

const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, error, showPasswordToggle = false, type = 'text', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;
    const isPasswordField = type === 'password' || showPasswordToggle;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const labelFloated = isFocused || hasValue || props.value;

    return (
      <div className="relative w-full group">
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "peer w-full px-4 py-3 border-2 rounded-xl bg-transparent transition-all duration-200 outline-none",
              "text-gray-900 dark:text-white placeholder-transparent",
              "border-gray-300 dark:border-gray-600",
              "focus:border-iwc-orange focus:ring-2 focus:ring-iwc-orange/20 dark:focus:border-iwc-blue dark:focus:ring-iwc-blue/20",
              "hover:border-iwc-orange/70 dark:hover:border-iwc-blue/70",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              isPasswordField && "pr-12",
              className
            )}
            placeholder=" "
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleInputChange}
            {...props}
          />
          
          <label className={cn(
            "absolute left-4 transition-all duration-200 pointer-events-none",
            "text-gray-500 dark:text-gray-400",
            labelFloated 
              ? "top-0 -translate-y-1/2 text-xs bg-white dark:bg-gray-800 px-2 rounded text-iwc-orange dark:text-iwc-blue font-medium"
              : "top-1/2 -translate-y-1/2 text-base",
            error && labelFloated && "text-red-500"
          )}>
            {label}
          </label>

          {isPasswordField && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-iwc-orange/50 rounded"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-shake">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';

export { FloatingInput };
