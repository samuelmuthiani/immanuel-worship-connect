
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { logger } from '@/lib/logger';

type TableName = keyof Database['public']['Tables'];

// Export data to CSV format
export const exportToCSV = <T extends Record<string, unknown>>(data: T[], filename: string) => {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',')
          ? `"${value}"`
          : value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};

// Get dashboard analytics
export const getDashboardAnalytics = async () => {
  try {
    const [
      { count: totalMembers },
      { count: totalEvents },
      { count: totalSubmissions },
      { count: totalSubscribers },
      { count: totalRegistrations },
      { count: totalGuests },
      { count: totalPageViews }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true }),
      supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
      supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
      supabase.from('event_registrations').select('*', { count: 'exact', head: true }),
      supabase.from('event_registrations').select('*', { count: 'exact', head: true }).eq('is_guest', true),
      supabase.from('page_views').select('*', { count: 'exact', head: true })
    ]);

    return {
      totalMembers: totalMembers || 0,
      totalEvents: totalEvents || 0,
      totalSubmissions: totalSubmissions || 0,
      totalSubscribers: totalSubscribers || 0,
      totalRegistrations: totalRegistrations || 0,
      totalGuests: totalGuests || 0,
      totalPageViews: totalPageViews || 0
    };
  } catch (error) {
    logger.error('Error fetching analytics:', error);
    return {
      totalMembers: 0,
      totalEvents: 0,
      totalSubmissions: 0,
      totalSubscribers: 0,
      totalRegistrations: 0,
      totalGuests: 0
    };
  }
};

// Bulk operations - simplified type handling
export const bulkDeleteItems = async (table: string, ids: string[]) => {
  try {
    const { error } = await (supabase as any)
      .from(table)
      .delete()
      .in('id', ids);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    logger.error(`Error bulk deleting from ${table}:`, error);
    return { success: false, error };
  }
};

// User management
export const updateUserRole = async (userId: string, role: string) => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .upsert([{ user_id: userId, role: role as any }]);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    logger.error('Error updating user role:', error);
    return { success: false, error };
  }
};

// Audit logging
export const logAuditAction = async (action: string, target?: string, details?: Record<string, unknown>) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('audit_logs')
      .insert([{
        action,
        resource_type: target,
        details: details as any,
        user_id: user?.id,
      }]);

    if (error) throw error;
  } catch (error) {
    logger.error('Error logging audit action:', error);
  }
};
