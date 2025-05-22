
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // Store the attempted URL for redirection after login
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
    }
  }, [loading, user, location.pathname]);

  if (loading) {
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

  // Role-based access check
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
