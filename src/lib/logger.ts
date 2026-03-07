import { supabase } from '@/integrations/supabase/client';

/**
 * Enhanced logger utility that logs to console in dev 
 * and optionally to database for critical errors in production.
 */
const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },
  error: async (...args: unknown[]) => {
    if (isDev) console.error(...args);
    
    // Log critical errors to Supabase audit_logs in production
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('audit_logs').insert([{
        action: 'ERROR',
        resource_type: 'SYSTEM',
        details: { 
          message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '),
          stack: new Error().stack,
          url: window.location.href,
          timestamp: new Date().toISOString()
        },
        user_id: user?.id
      }]);
    } catch (e) {
      // Silent fail to avoid infinite loop
    }
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args);
  },
  info: (...args: unknown[]) => {
    if (isDev) console.info(...args);
  },
};
