
import { supabase } from '@/integrations/supabase/client';

/**
 * Logs an audit event to the audit_logs table
 * @param userId The ID of the user performing the action
 * @param action The action being performed (e.g., 'delete_event', 'change_role')
 * @param details Additional details about the action (optional)
 * @param target The target of the action (e.g., user ID, event ID) (optional)
 * @returns Promise that resolves when the audit log has been created
 */
export async function logAudit(
  userId: string, 
  action: string, 
  details?: string | object,
  target?: string
) {
  try {
    const { error } = await supabase.from('audit_logs').insert([
      {
        user_id: userId,
        action,
        details: typeof details === 'string' ? details : details || null,
        target: target || null,
        timestamp: new Date().toISOString(),
      },
    ]);
    
    if (error) {
      console.error('Error logging audit event:', error);
    }
    
    return !error;
  } catch (err) {
    console.error('Exception logging audit event:', err);
    return false;
  }
}

/**
 * Retrieves audit logs with optional filtering
 * @param filters Optional filters to apply (userId, action, fromDate, toDate)
 * @returns Promise that resolves to the retrieved audit logs
 */
export async function getAuditLogs({
  userId,
  action,
  fromDate,
  toDate,
  limit = 100,
  offset = 0,
}: {
  userId?: string;
  action?: string;
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
  offset?: number;
} = {}) {
  let query = supabase
    .from('audit_logs')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(limit)
    .range(offset, offset + limit - 1);

  if (userId) {
    query = query.eq('user_id', userId);
  }
  
  if (action) {
    query = query.eq('action', action);
  }
  
  if (fromDate) {
    query = query.gte('timestamp', fromDate.toISOString());
  }
  
  if (toDate) {
    query = query.lte('timestamp', toDate.toISOString());
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error retrieving audit logs:', error);
    return [];
  }
  
  return data;
}
