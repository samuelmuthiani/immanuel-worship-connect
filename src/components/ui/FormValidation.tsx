
import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ValidationMessageProps {
  type: 'error' | 'success' | 'warning';
  message: string;
  className?: string;
}

export const ValidationMessage: React.FC<ValidationMessageProps> = ({
  type,
  message,
  className = ''
}) => {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300',
    success: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300'
  };

  const icons = {
    error: AlertCircle,
    success: CheckCircle2,
    warning: AlertCircle
  };

  const Icon = icons[type];

  return (
    <div className={`flex items-center gap-2 p-3 rounded-md border ${styles[type]} ${className}`}>
      <Icon className="h-4 w-4 flex-shrink-0" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required = false,
  children,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <ValidationMessage type="error" message={error} />
      )}
    </div>
  );
};
