
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  adminOnly?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole, adminOnly = false }) => {
  const { user, isLoading, hasRole } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      // Store the attempted URL for redirection after login
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
    }
  }, [isLoading, user, location.pathname]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <Loader2 className="h-12 w-12 text-iwc-blue animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Verifying your access...</p>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Special case for admin emails
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
