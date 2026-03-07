
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SecurityService } from '@/utils/security';
import { logger } from '@/lib/logger';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  adminOnly?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole, adminOnly = false }) => {
  const { user, isLoading, hasRole, session } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (session?.access_token && !SecurityService.validateSessionToken(session.access_token)) {
      logger.warn('Invalid session token detected');
    }

    if (!isLoading && !user) {
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
    }
  }, [isLoading, user, location.pathname, session]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-iwc-blue" />
        <p className="text-lg font-medium text-muted-foreground mt-4">Verifying your access...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.email && !user.email_confirmed_at) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Email Verification Required
          </h2>
          <p className="text-muted-foreground mb-4">
            Please check your email and click the verification link before accessing this area.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="text-primary hover:underline"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (adminOnly && !hasRole('admin')) {
    return <Navigate to="/member" replace />;
  }

  if (requiredRole && !hasRole(requiredRole) && !hasRole('admin')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
