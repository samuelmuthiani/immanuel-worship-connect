
// Centralized Supabase storage utilities with enhanced security
import { supabase } from '@/integrations/supabase/client';
import { SecurityService } from './security';
import { logger } from '@/lib/logger';

// Contact form submission with simplified validation
export const saveContactSubmission = async (formData: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  inquiry_type?: string;
}) => {
  try {
    const sanitizedData = {
      name: SecurityService.sanitizeInput(formData.name),
      email: SecurityService.sanitizeInput(formData.email),
      phone: formData.phone ? SecurityService.sanitizeInput(formData.phone) : null,
      subject: formData.subject ? SecurityService.sanitizeInput(formData.subject) : null,
      message: SecurityService.sanitizeInput(formData.message),
      inquiry_type: formData.inquiry_type ? SecurityService.sanitizeInput(formData.inquiry_type) : 'general'
    };

    if (!sanitizedData.name || !sanitizedData.message || !sanitizedData.email) {
      throw new Error('Name, email, and message are required');
    }

    logger.log('Saving contact submission');

    const { error } = await supabase
      .from('contact_submissions')
      .insert([{
        ...sanitizedData,
        submitted_at: new Date().toISOString()
      }]);

    if (error) {
      logger.error('Error saving contact:', error);
      throw error;
    }

    logger.log('Contact submission saved successfully');

    // Trigger email notification via Edge Function
    try {
      const emailResponse = await supabase.functions.invoke('send-email', {
        body: {
          to: 'admin@iwc.com',
          subject: `New Contact Inquiry: ${sanitizedData.subject || 'No Subject'}`,
          html: `
            <h2>New Contact Submission</h2>
            <p><strong>Name:</strong> ${sanitizedData.name}</p>
            <p><strong>Email:</strong> ${sanitizedData.email}</p>
            <p><strong>Type:</strong> ${sanitizedData.inquiry_type}</p>
            <p><strong>Message:</strong></p>
            <p>${sanitizedData.message}</p>
          `,
          from: 'Immanuel Worship Connect <onboarding@resend.dev>'
        }
      });

      if (emailResponse.error) {
        logger.warn('Failed to send notification email:', emailResponse.error);
      }
    } catch (emailError) {
      logger.error('Error invoking send-email function:', emailError);
    }

    return { success: true };
  } catch (error) {
    logger.error('Error saving contact submission:', error);
    return { success: false, error };
  }
};

// Event RSVP submission with validation
export const saveEventRSVP = async (eventId: string, rsvpData: {
  name: string;
  email: string;
  phone?: string;
}) => {
  try {
    const sanitizedData = {
      name: SecurityService.sanitizeInput(rsvpData.name),
      email: SecurityService.sanitizeInput(rsvpData.email),
      phone: rsvpData.phone ? SecurityService.sanitizeInput(rsvpData.phone) : null
    };

    if (!sanitizedData.name || !sanitizedData.email) {
      throw new Error('Name and email are required');
    }

    logger.log('Saving event RSVP');

    const { data, error } = await supabase
      .from('event_registrations')
      .insert([{
        event_id: eventId,
        ...sanitizedData,
        registered_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      logger.error('Error saving RSVP:', error);
      throw error;
    }

    logger.log('RSVP saved successfully');
    return { success: true, data };
  } catch (error) {
    logger.error('Error saving RSVP:', error);
    return { success: false, error };
  }
};

// Newsletter subscription with duplicate prevention
export const saveNewsletterSubscription = async (email: string) => {
  try {
    const sanitizedEmail = SecurityService.sanitizeInput(email);

    if (!sanitizedEmail) {
      throw new Error('Valid email address is required');
    }

    logger.log('Saving newsletter subscription');

    const { data, error } = await supabase.functions.invoke('newsletter-subscribe', {
      body: {
        email: sanitizedEmail,
        source_page: window.location.pathname
      }
    });

    if (error || data?.error) {
      const message = data?.error || error?.message || 'Failed to subscribe to newsletter';
      throw new Error(message);
    }

    logger.log('Newsletter subscription saved successfully');
    return { success: true, data };
  } catch (error) {
    logger.error('Error saving newsletter subscription:', error);
    return { success: false, error };
  }
};

// Secure donation utilities
export const saveDonationToSupabase = async (donationData: {
  amount: number;
  donation_type: string;
  payment_method?: string;
  transaction_reference?: string;
  notes?: string;
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    if (typeof donationData.amount !== 'number' || donationData.amount <= 0 || donationData.amount > 1000000) {
      throw new Error('Invalid donation amount');
    }

    const sanitizedData = {
      amount: donationData.amount,
      donation_type: SecurityService.sanitizeInput(donationData.donation_type),
      payment_method: donationData.payment_method ? SecurityService.sanitizeInput(donationData.payment_method) : null,
      transaction_reference: donationData.transaction_reference ? SecurityService.sanitizeInput(donationData.transaction_reference) : null,
      notes: donationData.notes ? SecurityService.sanitizeInput(donationData.notes) : null
    };

    logger.log('Saving donation');

    const { data, error } = await supabase
      .from('donations')
      .insert([{
        user_id: user.id,
        ...sanitizedData,
      }])
      .select();

    if (error) {
      logger.error('Error saving donation:', error);
      throw error;
    }

    logger.log('Donation saved successfully');
    return { success: true, data };
  } catch (error) {
    logger.error('Error saving donation:', error);
    return { success: false, error };
  }
};

// Admin functions with proper access control
export const getAllContactSubmissions = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      logger.error('Error fetching contact submissions:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    logger.error('Error fetching contact submissions:', error);
    return [];
  }
};

export const getAllEventRegistrations = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    const { data, error } = await supabase
      .from('event_registrations')
      .select(`
        *,
        events(title, event_date)
      `)
      .order('registered_at', { ascending: false });

    if (error) {
      logger.error('Error fetching event registrations:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error('Error fetching event registrations:', error);
    return [];
  }
};

export const getAllNewsletterSubscribers = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching newsletter subscribers:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    logger.error('Error fetching newsletter subscribers:', error);
    return [];
  }
};

// Enhanced donation fetching functions
export const getAllDonationsFromSupabase = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching donations:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    logger.error('Error fetching donations:', error);
    return [];
  }
};

export const getUserDonationsFromSupabase = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching user donations:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    logger.error('Error fetching user donations:', error);
    return [];
  }
};
