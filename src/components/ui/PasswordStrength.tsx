
import React from 'react';
import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password, className }) => {
  const getStrength = (pwd: string): { level: number; text: string; color: string } => {
    if (!pwd) return { level: 0, text: '', color: '' };
    
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score < 2) return { level: 1, text: 'Weak', color: 'bg-red-500' };
    if (score < 4) return { level: 2, text: 'Fair', color: 'bg-yellow-500' };
    if (score < 5) return { level: 3, text: 'Good', color: 'bg-blue-500' };
    return { level: 4, text: 'Strong', color: 'bg-gradient-to-r from-iwc-gold via-iwc-orange to-iwc-blue' };
  };

  const strength = getStrength(password);
  
  if (!password) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600 dark:text-gray-400">
          Password strength
        </span>
        <span className={cn(
          "text-xs font-medium",
          strength.level === 1 && "text-red-600 dark:text-red-400",
          strength.level === 2 && "text-yellow-600 dark:text-yellow-400",
          strength.level === 3 && "text-blue-600 dark:text-blue-400",
          strength.level === 4 && "text-green-600 dark:text-green-400"
        )}>
          {strength.text}
        </span>
      </div>
      
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-300 rounded-full",
            strength.color
          )}
          style={{ width: `${(strength.level / 4) * 100}%` }}
        />
      </div>
    </div>
  );
};
