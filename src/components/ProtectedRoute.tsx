
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SecurityService } from '@/utils/security';
import { logger } from '@/lib/logger';

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
    if (session?.access_token && !SecurityService.validateSessionToken(session.access_token)) {
      logger.warn('Invalid session token detected in ProtectedRoute');
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Securing your session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
    return <Navigate to="/login" replace />;
  }

  if (user.email && !user.email_confirmed_at) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md text-center p-8 bg-card border border-border rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Email Verification Required
          </h2>
          <p className="text-muted-foreground mb-6">
            Please verify your email address to continue. Check your inbox for a verification link.
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (adminOnly && !isAdmin) {
    logger.warn(`Unauthorized admin access attempt by user: ${user.id}`);
    return <Navigate to="/member" replace />;
  }

  if (requiredRole && !hasRole(requiredRole) && !hasRole('admin')) {
    logger.warn(`Unauthorized role access attempt by user: ${user.id}, required: ${requiredRole}`);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
