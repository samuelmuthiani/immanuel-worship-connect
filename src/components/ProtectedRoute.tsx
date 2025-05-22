import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (isMounted) {
          setAuthorized(false);
          setLoading(false);
          navigate('/login', { replace: true });
        }
        return;
      }
      // Check user_roles table for role
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      if (isMounted) {
        if (!roles || roles.length === 0) {
          setAuthorized(false);
          setLoading(false);
          navigate('/login', { replace: true });
        } else {
          setAuthorized(true);
          setLoading(false);
        }
      }
    };
    checkAuth();
    return () => { isMounted = false; };
  }, [navigate]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!authorized) return null;
  return <>{children}</>;
};
