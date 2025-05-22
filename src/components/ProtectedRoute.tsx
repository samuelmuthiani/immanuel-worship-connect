import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  adminOnly = false 
}) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (!user) {
          if (isMounted) {
            setAuthorized(false);
            setLoading(false);
            navigate('/login', { replace: true });
          }
          return;
        }

        // Special handling for admin emails
        const adminEmails = ['admin@iwc.com', 'samuel.watho@gmail.com'];
        if (adminEmails.includes(user.email || '') && adminOnly) {
          if (isMounted) {
            setAuthorized(true);
            setLoading(false);
          }
          return;
        }
        
        // If no specific role required and not admin-only page, just being logged in is sufficient
        if (!requiredRole && !adminOnly) {
          if (isMounted) {
            setAuthorized(true);
            setLoading(false);
          }
          return;
        }
        
        // Check user_roles table for specific role
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
          
        if (rolesError) throw rolesError;
        
        if (isMounted) {
          if (!roles || roles.length === 0) {
            setAuthorized(false);
            setLoading(false);
            toast({
              title: "Access Denied",
              description: "You don't have permission to access this area.",
              variant: "destructive",
            });
            navigate('/login', { replace: true });
          } else {
            // If this is admin-only page, check for admin role
            if (adminOnly) {
              const isAdmin = roles.some(r => r.role === 'admin');
              
              if (isAdmin) {
                setAuthorized(true);
                setLoading(false);
              } else {
                setAuthorized(false);
                setLoading(false);
                toast({
                  title: "Access Denied",
                  description: "Only administrators can access this area.",
                  variant: "destructive",
                });
                navigate('/member', { replace: true });
              }
            } 
            // Otherwise check for the required role
            else if (requiredRole) {
              // Check if user has the required role
              const hasRequiredRole = roles.some(r => 
                r.role === requiredRole || r.role === 'admin'
              );
              
              if (hasRequiredRole) {
                setAuthorized(true);
                setLoading(false);
              } else {
                setAuthorized(false);
                setLoading(false);
                toast({
                  title: "Access Denied",
                  description: `You need ${requiredRole} access to view this page.`,
                  variant: "destructive",
                });
                navigate('/', { replace: true });
              }
            } else {
              // User has some role, and no specific role is required
              setAuthorized(true);
              setLoading(false);
            }
          }
        }
      } catch (err) {
        console.error("Authentication error:", err);
        if (isMounted) {
          setAuthorized(false);
          setLoading(false);
          toast({
            title: "Authentication Error",
            description: "Please try logging in again.",
            variant: "destructive",
          });
          navigate('/login', { replace: true });
        }
      }
    };
    
    checkAuth();
    
    return () => { isMounted = false; };
  }, [navigate, requiredRole, adminOnly, toast]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <Loader2 className="h-12 w-12 text-iwc-blue animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Verifying your access...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          You don't have permission to access this page.
        </p>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
