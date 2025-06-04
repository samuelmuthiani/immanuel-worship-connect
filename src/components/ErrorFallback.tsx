
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
            Something went wrong
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              Error details
            </summary>
            <pre className="mt-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
          <div className="mt-6">
            <Button onClick={resetErrorBoundary} className="w-full">
              Try again
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
