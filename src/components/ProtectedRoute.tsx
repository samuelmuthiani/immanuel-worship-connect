
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SecurityService } from '@/utils/security';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false,
  requiredRole 
}) => {
  const { user, isAdmin, isLoading, hasRole, session } = useAuth();
  const location = useLocation();

  React.useEffect(() => {
    // Validate session integrity
    if (session?.access_token && !SecurityService.validateSessionToken(session.access_token)) {
      console.warn('Invalid session token detected in ProtectedRoute');
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Securing your session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
    return <Navigate to="/login" replace />;
  }

  // Check email verification status
  if (user.email && !user.email_confirmed_at) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Email Verification Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please verify your email address to continue. Check your inbox for a verification link.
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Admin access check
  if (adminOnly && !isAdmin) {
    console.warn(`Unauthorized admin access attempt by user: ${user.id}`);
    return <Navigate to="/member" replace />;
  }

  // Role-based access check
  if (requiredRole && !hasRole(requiredRole) && !hasRole('admin')) {
    console.warn(`Unauthorized role access attempt by user: ${user.id}, required: ${requiredRole}`);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
