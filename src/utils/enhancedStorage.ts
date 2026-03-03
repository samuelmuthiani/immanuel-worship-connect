import { supabase } from '@/integrations/supabase/client';
import { DataValidation, contactFormSchema, RateLimiter } from './dataValidation';
import { logger } from '@/lib/logger';

export interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  inquiry_type: 'general' | 'prayer' | 'ministry' | 'event' | 'support';
}

export interface EventRegistration {
  name: string;
  email: string;
  phone?: string;
  event_id: string;
}

interface ContactSubmissionResult {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
  inquiry_type: string;
  submitted_at: string;
  user_id?: string;
}

interface NewsletterSubscriptionResult {
  id: string;
  email: string;
  subscribed_at: string;
}

interface DashboardAnalytics {
  totalUsers: number;
  totalContacts: number;
  totalRegistrations: number;
  totalSubscribers: number;
  newUsersMonth: number;
  contactsMonth: number;
  registrationsMonth: number;
}

export class EnhancedStorage {
  static async saveContactSubmission(data: ContactSubmission): Promise<{
    success: boolean;
    error?: string;
    data?: ContactSubmissionResult;
  }> {
    try {
      const clientId = `contact_${data.email}`;
      if (!RateLimiter.isAllowed(clientId, 3, 300000)) {
        return {
          success: false,
          error: 'Too many submission attempts. Please wait before trying again.'
        };
      }

      const validation = await DataValidation.validateAndSanitize(data, contactFormSchema);
      if (!validation.success) {
        const errorResult = validation as { success: false; errors: string[] };
        return {
          success: false,
          error: `Validation failed: ${errorResult.errors.join(', ')}`
        };
      }

      const validatedData = validation.data;
      const sanitizedData = {
        name: DataValidation.sanitizeInput(validatedData.name!),
        email: DataValidation.sanitizeInput(validatedData.email!),
        subject: validatedData.subject ? DataValidation.sanitizeInput(validatedData.subject) : null,
        message: DataValidation.sanitizeInput(validatedData.message!),
        phone: validatedData.phone ? DataValidation.normalizePhoneNumber(validatedData.phone) : null,
        inquiry_type: validatedData.inquiry_type!,
        submitted_at: new Date().toISOString()
      };

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        (sanitizedData as ContactSubmissionResult & { user_id: string }).user_id = user.id;
      }

      logger.log('Saving contact submission');

      const { error } = await supabase
        .from('contact_submissions')
        .insert([sanitizedData]);

      if (error) {
        logger.error('Error saving contact submission:', error);
        throw error;
      }

      RateLimiter.reset(clientId);

      logger.log('Contact submission saved successfully');
      return { success: true };

    } catch (error: unknown) {
      logger.error('Error in saveContactSubmission:', error);
      return {
        success: false,
        error: (error as Error).message || 'Failed to submit contact form'
      };
    }
  }

  static async saveNewsletterSubscription(email: string): Promise<{
    success: boolean;
    error?: string;
    data?: NewsletterSubscriptionResult;
  }> {
    try {
      if (!DataValidation.validateEmail(email)) {
        return {
          success: false,
          error: 'Invalid email address'
        };
      }

      const sanitizedEmail = DataValidation.sanitizeInput(email.toLowerCase());

      const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('id')
        .eq('email', sanitizedEmail)
        .maybeSingle();

      if (existing) {
        return {
          success: false,
          error: 'Email already subscribed to newsletter'
        };
      }

      const { data: result, error } = await supabase
        .from('newsletter_subscribers')
        .insert([{
          email: sanitizedEmail,
          subscribed_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        logger.error('Error saving newsletter subscription:', error);
        throw error;
      }

      return { success: true, data: result };

    } catch (error: unknown) {
      logger.error('Error in saveNewsletterSubscription:', error);
      return {
        success: false,
        error: (error as Error).message || 'Failed to subscribe to newsletter'
      };
    }
  }

  static async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication required');

      const [
        { count: totalUsers },
        { count: totalContacts },
        { count: totalRegistrations },
        { count: totalSubscribers }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
        supabase.from('event_registrations').select('*', { count: 'exact', head: true }),
        supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true })
      ]);

      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const [
        { count: newUsersMonth },
        { count: contactsMonth },
        { count: registrationsMonth }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).gte('submitted_at', thirtyDaysAgo),
        supabase.from('event_registrations').select('*', { count: 'exact', head: true }).gte('registered_at', thirtyDaysAgo)
      ]);

      return {
        totalUsers: totalUsers || 0,
        totalContacts: totalContacts || 0,
        totalRegistrations: totalRegistrations || 0,
        totalSubscribers: totalSubscribers || 0,
        newUsersMonth: newUsersMonth || 0,
        contactsMonth: contactsMonth || 0,
        registrationsMonth: registrationsMonth || 0
      };

    } catch (error) {
      logger.error('Error fetching dashboard analytics:', error);
      return {
        totalUsers: 0,
        totalContacts: 0,
        totalRegistrations: 0,
        totalSubscribers: 0,
        newUsersMonth: 0,
        contactsMonth: 0,
        registrationsMonth: 0
      };
    }
  }
}

export const saveContactSubmission = EnhancedStorage.saveContactSubmission;
export const saveNewsletterSubscription = EnhancedStorage.saveNewsletterSubscription;
export const getDashboardAnalytics = EnhancedStorage.getDashboardAnalytics;
