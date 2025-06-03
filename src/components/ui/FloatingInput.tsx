
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
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

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
              "peer w-full px-4 py-3.5 border-2 rounded-xl bg-transparent transition-all duration-300 outline-none",
              "text-gray-900 dark:text-white placeholder-transparent",
              "border-gray-200 dark:border-gray-700",
              "focus:border-iwc-orange focus:shadow-[0_0_0_3px_rgba(245,158,66,0.15)] dark:focus:border-iwc-blue dark:focus:shadow-[0_0_0_3px_rgba(37,99,235,0.15)]",
              "hover:border-iwc-orange/60 dark:hover:border-iwc-blue/60",
              error && "border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]",
              isPasswordField && "pr-12",
              props.disabled && "opacity-50 cursor-not-allowed",
              className
            )}
            placeholder=" "
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleInputChange}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />
          
          <label 
            htmlFor={props.id}
            className={cn(
              "absolute left-4 transition-all duration-300 pointer-events-none select-none",
              "text-gray-500 dark:text-gray-400",
              labelFloated 
                ? "top-0 -translate-y-1/2 text-xs bg-white dark:bg-gray-800 px-2 rounded font-medium"
                : "top-1/2 -translate-y-1/2 text-base",
              isFocused && !error && "text-iwc-orange dark:text-iwc-blue",
              error && labelFloated && "text-red-500 dark:text-red-400"
            )}
          >
            {label}
          </label>

          {isPasswordField && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-iwc-orange/30 dark:focus:ring-iwc-blue/30 rounded-md"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>

        {error && (
          <p 
            id={`${props.id}-error`}
            className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
            role="alert"
          >
            <span className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0 mt-1.5"></span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';

export { FloatingInput };
