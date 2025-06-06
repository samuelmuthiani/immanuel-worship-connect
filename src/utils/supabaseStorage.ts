
// Centralized Supabase storage utilities with enhanced security
import { supabase } from '@/integrations/supabase/client';
import { SecurityService } from './security';

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
    // Validate and sanitize inputs
    const sanitizedData = {
      name: SecurityService.sanitizeInput(formData.name),
      email: SecurityService.sanitizeInput(formData.email),
      phone: formData.phone ? SecurityService.sanitizeInput(formData.phone) : null,
      subject: formData.subject ? SecurityService.sanitizeInput(formData.subject) : null,
      message: SecurityService.sanitizeInput(formData.message),
      inquiry_type: formData.inquiry_type ? SecurityService.sanitizeInput(formData.inquiry_type) : 'general'
    };

    // Validate required fields
    if (!sanitizedData.name || !sanitizedData.message || !sanitizedData.email) {
      throw new Error('Name, email, and message are required');
    }

    console.log('Saving contact submission:', sanitizedData);
    
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([{
        ...sanitizedData,
        submitted_at: new Date().toISOString()
      }])
      .select();
    
    if (error) {
      console.error('Supabase error saving contact:', error);
      throw error;
    }
    
    console.log('Contact submission saved successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error saving contact submission:', error);
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
    // Validate and sanitize
    const sanitizedData = {
      name: SecurityService.sanitizeInput(rsvpData.name),
      email: SecurityService.sanitizeInput(rsvpData.email),
      phone: rsvpData.phone ? SecurityService.sanitizeInput(rsvpData.phone) : null
    };

    if (!sanitizedData.name || !sanitizedData.email) {
      throw new Error('Name and email are required');
    }

    console.log('Saving event RSVP:', { eventId, rsvpData: sanitizedData });
    
    const { data, error } = await supabase
      .from('event_registrations')
      .insert([{
        event_id: eventId,
        ...sanitizedData,
        registered_at: new Date().toISOString()
      }])
      .select();
    
    if (error) {
      console.error('Supabase error saving RSVP:', error);
      throw error;
    }
    
    console.log('RSVP saved successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error saving RSVP:', error);
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

    console.log('Saving newsletter subscription:', sanitizedEmail);
    
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([{
        email: sanitizedEmail,
        subscribed_at: new Date().toISOString()
      }])
      .select();
    
    if (error) {
      console.error('Supabase error saving newsletter subscription:', error);
      
      // Handle duplicate email
      if (error.code === '23505') {
        throw new Error('This email is already subscribed to our newsletter.');
      }
      
      throw error;
    }
    
    console.log('Newsletter subscription saved successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error saving newsletter subscription:', error);
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

    // Validate donation amount
    if (typeof donationData.amount !== 'number' || donationData.amount <= 0 || donationData.amount > 1000000) {
      throw new Error('Invalid donation amount');
    }

    // Sanitize inputs
    const sanitizedData = {
      amount: donationData.amount,
      donation_type: SecurityService.sanitizeInput(donationData.donation_type),
      payment_method: donationData.payment_method ? SecurityService.sanitizeInput(donationData.payment_method) : null,
      transaction_reference: donationData.transaction_reference ? SecurityService.sanitizeInput(donationData.transaction_reference) : null,
      notes: donationData.notes ? SecurityService.sanitizeInput(donationData.notes) : null
    };

    console.log('Saving donation to Supabase:', sanitizedData);

    const { data, error } = await supabase
      .from('donations')
      .insert([{
        user_id: user.id,
        ...sanitizedData,
      }])
      .select();
    
    if (error) {
      console.error('Supabase error saving donation:', error);
      throw error;
    }
    
    console.log('Donation saved successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error saving donation:', error);
    return { success: false, error };
  }
};

// Admin functions with proper access control
export const getAllContactSubmissions = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    console.log('Fetching all contact submissions...');
    
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('submitted_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching contact submissions:', error);
      throw error;
    }
    
    console.log('Contact submissions fetched:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return [];
  }
};

export const getAllEventRegistrations = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    console.log('Fetching all event registrations...');
    
    const { data, error } = await supabase
      .from('event_registrations')
      .select(`
        *,
        events(title, event_date)
      `)
      .order('registered_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching event registrations:', error);
      return [];
    }
    
    console.log('Event registrations fetched:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    return [];
  }
};

export const getAllNewsletterSubscribers = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    console.log('Fetching all newsletter subscribers...');
    
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching newsletter subscribers:', error);
      throw error;
    }
    
    console.log('Newsletter subscribers fetched:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return [];
  }
};

// Enhanced donation fetching functions
export const getAllDonationsFromSupabase = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    console.log('Fetching all donations from Supabase...');
    
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching donations:', error);
      throw error;
    }
    
    console.log('Donations fetched:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error fetching donations:', error);
    return [];
  }
};

export const getUserDonationsFromSupabase = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    console.log('Fetching user donations for:', user.id);

    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user donations:', error);
      throw error;
    }
    
    console.log('User donations fetched:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error fetching user donations:', error);
    return [];
  }
};
