
import React from 'react';
import { SecurityService } from '@/utils/security';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const validation = SecurityService.validatePassword(password);
  
  if (!password) return null;

  const getStrengthColor = () => {
    if (validation.isValid) return 'text-green-600 dark:text-green-400';
    if (password.length >= 6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getStrengthText = () => {
    if (validation.isValid) return 'Strong password';
    if (password.length >= 6) return 'Moderate password';
    return 'Weak password';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              validation.isValid 
                ? 'bg-green-500 w-full' 
                : password.length >= 6 
                  ? 'bg-yellow-500 w-2/3' 
                  : 'bg-red-500 w-1/3'
            }`}
          />
        </div>
        <span className={`text-xs font-medium ${getStrengthColor()}`}>
          {getStrengthText()}
        </span>
      </div>
      
      {!validation.isValid && validation.errors.length > 0 && (
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          {validation.errors.map((error, index) => (
            <li key={index} className="flex items-center space-x-1">
              <span className="text-red-500">•</span>
              <span>{error}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
