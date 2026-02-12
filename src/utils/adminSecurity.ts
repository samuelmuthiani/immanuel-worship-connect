
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface AdminAction {
  action: string;
  target: string;
  details?: Record<string, unknown>;
  userId?: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  target?: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export class AdminSecurityService {
  // Log admin actions for audit trail
  static async logAdminAction(action: AdminAction): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.error('Attempted admin action without authentication');
        return;
      }

      const { error } = await supabase
        .from('audit_logs')
        .insert({
          user_id: user.id,
          action: action.action,
          target: action.target,
          details: (action.details || {}) as Record<string, string | number | boolean | null>,
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to log admin action:', error);
      }
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  }

  // Verify admin privileges before sensitive operations
  static async verifyAdminAccess(requiredRole: string = 'admin'): Promise<{ isValid: boolean; user: User | null }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        return { isValid: false, user: null };
      }

      // Check user roles in database
      const { data: roles, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (roleError) {
        console.error('Error checking user roles:', roleError);
        return { isValid: false, user: null };
      }

      const userRoles = roles?.map(r => r.role) || [];
      const hasRequiredRole = userRoles.includes(requiredRole) || userRoles.includes('admin');

      return { isValid: hasRequiredRole, user };
    } catch (error) {
      console.error('Error verifying admin access:', error);
      return { isValid: false, user: null };
    }
  }

  // Secure user deletion with proper cascading
  static async deleteUser(targetUserId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { isValid, user } = await this.verifyAdminAccess();

      if (!isValid || !user) {
        return { success: false, error: 'Unauthorized access' };
      }

      // Prevent self-deletion
      if (user.id === targetUserId) {
        return { success: false, error: 'Cannot delete your own account' };
      }

      // Log the deletion attempt
      await this.logAdminAction({
        action: 'DELETE_USER',
        target: targetUserId,
        details: { deletedBy: user.id }
      });

      // Call Edge Function to delete user (requires Service Role)
      const { data, error } = await supabase.functions.invoke('admin-action', {
        body: {
          action: 'delete_user',
          targetId: targetUserId
        }
      });

      if (error) throw new Error(error.message || 'Failed to delete user');

      return { success: true };
    } catch (error: unknown) {
      console.error('Error deleting user:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  // Secure role assignment
  static async assignRole(targetUserId: string, role: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { isValid, user } = await this.verifyAdminAccess();

      if (!isValid || !user) {
        return { success: false, error: 'Unauthorized access' };
      }

      // Validate role
      const validRoles = ['admin', 'moderator', 'member'];
      if (!validRoles.includes(role)) {
        return { success: false, error: 'Invalid role' };
      }

      // Log the role assignment
      await this.logAdminAction({
        action: 'ASSIGN_ROLE',
        target: targetUserId,
        details: { role, assignedBy: user.id }
      });

      // Call Edge Function to assign role (bypasses RLS if needed and ensures consistency)
      const { data, error } = await supabase.functions.invoke('admin-action', {
        body: {
          action: 'assign_role',
          targetId: targetUserId,
          payload: { role }
        }
      });

      if (error) {
        console.error('Error assigning role:', error);
        return { success: false, error: error.message || 'Failed to assign role' };
      }

      return { success: true };
    } catch (error: unknown) {
      console.error('Error assigning role:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  // Get audit logs for admin review
  static async getAuditLogs(limit: number = 100): Promise<AuditLog[]> {
    try {
      const { isValid } = await this.verifyAdminAccess();

      if (!isValid) {
        throw new Error('Unauthorized access');
      }

      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching audit logs:', error);
        return [];
      }

      return (data || []) as AuditLog[];
    } catch (error) {
      console.error('Error getting audit logs:', error);
      return [];
    }
  }
}
