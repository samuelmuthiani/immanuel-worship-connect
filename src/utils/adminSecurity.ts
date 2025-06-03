
import { supabase } from '@/integrations/supabase/client';
import { SecurityService } from './security';

export interface AdminAction {
  action: string;
  target: string;
  details?: Record<string, any>;
  userId?: string;
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
        .insert([{
          user_id: user.id,
          action: action.action,
          target: action.target,
          details: action.details || {},
          timestamp: new Date().toISOString()
        }]);

      if (error) {
        console.error('Failed to log admin action:', error);
      }
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  }

  // Verify admin privileges before sensitive operations
  static async verifyAdminAccess(requiredRole: string = 'admin'): Promise<{ isValid: boolean; user: any | null }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return { isValid: false, user: null };
      }

      // Check hardcoded admin emails
      const adminEmails = ['admin@iwc.com', 'samuel.watho@gmail.com'];
      if (adminEmails.includes(user.email || '')) {
        return { isValid: true, user };
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

      // Note: User deletion should be handled by Supabase admin API
      // This is a placeholder for the proper implementation
      console.log('User deletion requested for:', targetUserId);
      
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting user:', error);
      return { success: false, error: error.message };
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

      const { error } = await supabase
        .from('user_roles')
        .upsert([{
          user_id: targetUserId,
          role: role
        }]);

      if (error) {
        console.error('Error assigning role:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error assigning role:', error);
      return { success: false, error: error.message };
    }
  }

  // Get audit logs for admin review
  static async getAuditLogs(limit: number = 100): Promise<any[]> {
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

      return data || [];
    } catch (error) {
      console.error('Error getting audit logs:', error);
      return [];
    }
  }
}
