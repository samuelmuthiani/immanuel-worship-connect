
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SecurityService } from '@/utils/security';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  adminOnly?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole, adminOnly = false }) => {
  const { user, isLoading, hasRole, session } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Validate session token if present
    if (session?.access_token && !SecurityService.validateSessionToken(session.access_token)) {
      console.warn('Invalid session token detected');
      // Could trigger logout here if needed
    }

    if (!isLoading && !user) {
      // Store the attempted URL for redirection after login
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
    }
  }, [isLoading, user, location.pathname, session]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <LoadingSpinner size="lg" />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mt-4">Verifying your access...</p>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for email verification (if Supabase is configured to require it)
  if (user.email && !user.email_confirmed_at) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Email Verification Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please check your email and click the verification link before accessing this area.
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Special case for hardcoded admin emails
  const adminEmails = ['admin@iwc.com', 'samuel.watho@gmail.com'];
  if (adminEmails.includes(user.email || '') && adminOnly) {
    return <>{children}</>;
  }

  // Admin only page check
  if (adminOnly && !hasRole('admin')) {
    return <Navigate to="/member" replace />;
  }

  // Role-based access check
  if (requiredRole && !hasRole(requiredRole) && !hasRole('admin')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
