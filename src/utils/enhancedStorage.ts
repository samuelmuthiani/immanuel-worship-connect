import { supabase } from '@/integrations/supabase/client';
import { DataValidation, contactFormSchema, RateLimiter } from './dataValidation';

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

export class EnhancedStorage {
  // Enhanced contact submission with validation and rate limiting
  static async saveContactSubmission(data: ContactSubmission): Promise<{
    success: boolean;
    error?: string;
    data?: any;
  }> {
    try {
      // Rate limiting check
      const clientId = `contact_${data.email}`;
      if (!RateLimiter.isAllowed(clientId, 3, 300000)) { // 3 attempts per 5 minutes
        return {
          success: false,
          error: 'Too many submission attempts. Please wait before trying again.'
        };
      }

      // Validate and sanitize input
      const validation = await DataValidation.validateAndSanitize(data, contactFormSchema);
      if (!validation.success) {
        return {
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`
        };
      }

      const sanitizedData = {
        ...validation.data,
        name: DataValidation.sanitizeInput(validation.data.name),
        email: DataValidation.sanitizeInput(validation.data.email),
        subject: validation.data.subject ? DataValidation.sanitizeInput(validation.data.subject) : null,
        message: DataValidation.sanitizeInput(validation.data.message),
        phone: validation.data.phone ? DataValidation.normalizePhoneNumber(validation.data.phone) : null,
        submitted_at: new Date().toISOString()
      };

      // Get current user if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      // If user is authenticated, link the submission to their profile
      if (user) {
        (sanitizedData as any).user_id = user.id;
      }

      console.log('Saving contact submission:', sanitizedData);

      const { data: result, error } = await supabase
        .from('contact_submissions')
        .insert([sanitizedData])
        .select()
        .single();

      if (error) {
        console.error('Error saving contact submission:', error);
        throw error;
      }

      // Reset rate limit on successful submission
      RateLimiter.reset(clientId);

      console.log('Contact submission saved successfully:', result);
      return { success: true, data: result };

    } catch (error: any) {
      console.error('Error in saveContactSubmission:', error);
      return {
        success: false,
        error: error.message || 'Failed to submit contact form'
      };
    }
  }

  // Enhanced newsletter subscription with deduplication
  static async saveNewsletterSubscription(email: string): Promise<{
    success: boolean;
    error?: string;
    data?: any;
  }> {
    try {
      if (!DataValidation.validateEmail(email)) {
        return {
          success: false,
          error: 'Invalid email address'
        };
      }

      const sanitizedEmail = DataValidation.sanitizeInput(email.toLowerCase());

      // Check for existing subscription
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
        console.error('Error saving newsletter subscription:', error);
        throw error;
      }

      return { success: true, data: result };

    } catch (error: any) {
      console.error('Error in saveNewsletterSubscription:', error);
      return {
        success: false,
        error: error.message || 'Failed to subscribe to newsletter'
      };
    }
  }

  // Get enhanced dashboard analytics
  static async getDashboardAnalytics(): Promise<any> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication required');

      // Get comprehensive analytics data
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

      // Get monthly stats
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
      console.error('Error fetching dashboard analytics:', error);
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

// Update storage.ts to use enhanced methods
export const saveContactSubmission = EnhancedStorage.saveContactSubmission;
export const saveNewsletterSubscription = EnhancedStorage.saveNewsletterSubscription;
export const getDashboardAnalytics = EnhancedStorage.getDashboardAnalytics;

// Keep existing exports for backward compatibility but prevent conflicts
export * from './supabaseStorage';
export * from './adminUtils';
export * from './profileUtils';
export * from './eventUtils';
