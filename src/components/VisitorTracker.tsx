import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const VisitorTracker = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        // Record path change in page_views table
        const { error } = await (supabase as any).from('page_views').insert([{
          path: location.pathname + location.search,
          referrer: document.referrer || null,
          user_id: user?.id || null,
          user_agent: navigator.userAgent
        }]);
        
        if (error) {
          // Silent fail on tracking errors to not affect UX
          console.debug('Tracking error:', error);
        }
      } catch (err) {
        console.debug('Tracking exception:', err);
      }
    };

    trackPageView();
  }, [location.pathname, location.search, user?.id]);

  return null;
};

export default VisitorTracker;
