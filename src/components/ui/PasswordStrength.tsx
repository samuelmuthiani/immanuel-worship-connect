
import React from 'react';
import { cn } from '@/lib/utils';

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password, className }) => {
  const getStrength = (pwd: string): { level: number; text: string; color: string; width: string } => {
    if (!pwd) return { level: 0, text: '', color: '', width: '0%' };
    
    let score = 0;
    const checks = [
      pwd.length >= 8,
      /[A-Z]/.test(pwd),
      /[a-z]/.test(pwd),
      /[0-9]/.test(pwd),
      /[^A-Za-z0-9]/.test(pwd)
    ];
    
    score = checks.filter(Boolean).length;

    if (score < 2) return { 
      level: 1, 
      text: 'Weak', 
      color: 'bg-red-500', 
      width: '25%' 
    };
    if (score < 4) return { 
      level: 2, 
      text: 'Fair', 
      color: 'bg-yellow-500', 
      width: '50%' 
    };
    if (score < 5) return { 
      level: 3, 
      text: 'Good', 
      color: 'bg-blue-500', 
      width: '75%' 
    };
    return { 
      level: 4, 
      text: 'Strong', 
      color: 'bg-gradient-to-r from-iwc-gold via-iwc-orange to-iwc-blue', 
      width: '100%' 
    };
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
          "text-xs font-medium transition-colors duration-300",
          strength.level === 1 && "text-red-600 dark:text-red-400",
          strength.level === 2 && "text-yellow-600 dark:text-yellow-400",
          strength.level === 3 && "text-blue-600 dark:text-blue-400",
          strength.level === 4 && "text-green-600 dark:text-green-400"
        )}>
          {strength.text}
        </span>
      </div>
      
      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-500 ease-out rounded-full",
            strength.color
          )}
          style={{ width: strength.width }}
        />
      </div>
      
      {password.length > 0 && (
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className={cn("flex items-center gap-1", password.length >= 8 ? "text-green-600 dark:text-green-400" : "")}>
            <span className={cn("w-1 h-1 rounded-full", password.length >= 8 ? "bg-green-500" : "bg-gray-300")} />
            8+ characters
          </div>
          <div className={cn("flex items-center gap-1", /[A-Z]/.test(password) ? "text-green-600 dark:text-green-400" : "")}>
            <span className={cn("w-1 h-1 rounded-full", /[A-Z]/.test(password) ? "bg-green-500" : "bg-gray-300")} />
            Uppercase
          </div>
          <div className={cn("flex items-center gap-1", /[0-9]/.test(password) ? "text-green-600 dark:text-green-400" : "")}>
            <span className={cn("w-1 h-1 rounded-full", /[0-9]/.test(password) ? "bg-green-500" : "bg-gray-300")} />
            Number
          </div>
          <div className={cn("flex items-center gap-1", /[^A-Za-z0-9]/.test(password) ? "text-green-600 dark:text-green-400" : "")}>
            <span className={cn("w-1 h-1 rounded-full", /[^A-Za-z0-9]/.test(password) ? "bg-green-500" : "bg-gray-300")} />
            Symbol
          </div>
        </div>
      )}
    </div>
  );
};
