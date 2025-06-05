
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FloatingInputProps {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  showPasswordToggle?: boolean;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  id,
  type,
  label,
  value,
  onChange,
  error,
  disabled = false,
  autoComplete,
  autoFocus = false,
  showPasswordToggle = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = showPasswordToggle && showPassword ? 'text' : type;
  const isFloating = isFocused || value;

  return (
    <div className="relative">
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          className={`
            peer w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-800 
            text-gray-900 dark:text-white transition-all duration-200 outline-none
            ${error 
              ? 'border-red-300 dark:border-red-600 focus:border-red-500 dark:focus:border-red-400' 
              : 'border-gray-300 dark:border-gray-600 focus:border-iwc-blue dark:focus:border-iwc-orange'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${showPasswordToggle ? 'pr-12' : ''}
          `}
          placeholder=" "
        />
        
        <label
          htmlFor={id}
          className={`
            absolute left-4 transition-all duration-200 pointer-events-none
            ${isFloating 
              ? 'top-2 text-xs text-iwc-blue dark:text-iwc-orange' 
              : 'top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400'
            }
            ${error ? 'text-red-500 dark:text-red-400' : ''}
          `}
        >
          {label}
        </label>

        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            disabled={disabled}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 animate-shake">
          {error}
        </p>
      )}
    </div>
  );
};
