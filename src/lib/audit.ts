
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

/**
 * Logs an audit event to the audit_logs table
 */
export async function logAudit(
  userId: string, 
  action: string, 
  details?: string | object,
  target?: string
) {
  try {
    const detailsValue = typeof details === 'object' ? JSON.stringify(details) : details || null;
    
    const { error } = await supabase.from('audit_logs').insert({
      user_id: userId,
      action,
      details: detailsValue,
      resource_type: target || null,
    });
    
    if (error) {
      logger.error('Error logging audit event:', error);
    }
    
    return !error;
  } catch (err) {
    logger.error('Exception logging audit event:', err);
    return false;
  }
}

/**
 * Retrieves audit logs with optional filtering
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
    .order('created_at', { ascending: false })
    .limit(limit)
    .range(offset, offset + limit - 1);

  if (userId) {
    query = query.eq('user_id', userId);
  }
  
  if (action) {
    query = query.eq('action', action);
  }
  
  if (fromDate) {
    query = query.gte('created_at', fromDate.toISOString());
  }
  
  if (toDate) {
    query = query.lte('created_at', toDate.toISOString());
  }
  
  const { data, error } = await query;
  
  if (error) {
    logger.error('Error retrieving audit logs:', error);
    return [];
  }
  
  return data;
}
