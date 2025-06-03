// Centralized Supabase storage utilities with enhanced security
import { supabase } from '@/integrations/supabase/client';
import { SecurityService } from './security';

// Contact form submission with validation
export const saveContactSubmission = async (formData: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  inquiry_type?: string;
}) => {
  try {
    // Rate limiting check
    const clientIP = 'browser-session'; // In a real app, you'd get the actual IP
    if (SecurityService.isRateLimited(`contact-${clientIP}`, 3, 10 * 60 * 1000)) {
      throw new Error('Too many contact submissions. Please wait before trying again.');
    }

    // Validate and sanitize inputs
    const sanitizedData = {
      name: SecurityService.sanitizeInput(formData.name),
      email: SecurityService.sanitizeEmail(formData.email),
      phone: formData.phone ? SecurityService.sanitizeInput(formData.phone) : null,
      subject: formData.subject ? SecurityService.sanitizeInput(formData.subject) : null,
      message: SecurityService.sanitizeInput(formData.message),
      inquiry_type: formData.inquiry_type ? SecurityService.sanitizeInput(formData.inquiry_type) : null
    };

    // Validate email format
    if (!SecurityService.validateEmail(sanitizedData.email)) {
      throw new Error('Invalid email format');
    }

    // Validate required fields
    if (!sanitizedData.name || !sanitizedData.message) {
      throw new Error('Name and message are required');
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
    // Rate limiting
    const clientIP = 'browser-session';
    if (SecurityService.isRateLimited(`rsvp-${clientIP}`, 5, 15 * 60 * 1000)) {
      throw new Error('Too many RSVP submissions. Please wait before trying again.');
    }

    // Validate and sanitize
    const sanitizedData = {
      name: SecurityService.sanitizeInput(rsvpData.name),
      email: SecurityService.sanitizeEmail(rsvpData.email),
      phone: rsvpData.phone ? SecurityService.sanitizeInput(rsvpData.phone) : null
    };

    if (!SecurityService.validateEmail(sanitizedData.email)) {
      throw new Error('Invalid email format');
    }

    if (!sanitizedData.name) {
      throw new Error('Name is required');
    }

    // Validate event exists
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      throw new Error('Event not found');
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
    // Rate limiting
    const clientIP = 'browser-session';
    if (SecurityService.isRateLimited(`newsletter-${clientIP}`, 3, 10 * 60 * 1000)) {
      throw new Error('Too many subscription attempts. Please wait before trying again.');
    }

    const sanitizedEmail = SecurityService.sanitizeEmail(email);
    
    if (!SecurityService.validateEmail(sanitizedEmail)) {
      throw new Error('Invalid email format');
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

// Secure admin functions with proper access control
export const getAllDonationsFromSupabase = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    // Verify admin access
    const adminEmails = ['admin@iwc.com', 'samuel.watho@gmail.com'];
    let isAdmin = adminEmails.includes(user.email || '');

    if (!isAdmin) {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      isAdmin = roles?.some(r => r.role === 'admin') || false;
    }

    if (!isAdmin) {
      throw new Error('Administrative access required');
    }

    console.log('Fetching all donations from Supabase...');
    
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        user_email:get_user_email(user_id)
      `)
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

// Admin functions with proper access control
export const getAllContactSubmissions = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    // Verify admin access
    const adminEmails = ['admin@iwc.com', 'samuel.watho@gmail.com'];
    let isAdmin = adminEmails.includes(user.email || '');

    if (!isAdmin) {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      isAdmin = roles?.some(r => r.role === 'admin') || false;
    }

    if (!isAdmin) {
      throw new Error('Administrative access required');
    }

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

    // Verify admin access
    const adminEmails = ['admin@iwc.com', 'samuel.watho@gmail.com'];
    let isAdmin = adminEmails.includes(user.email || '');

    if (!isAdmin) {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      isAdmin = roles?.some(r => r.role === 'admin') || false;
    }

    if (!isAdmin) {
      throw new Error('Administrative access required');
    }

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
      throw error;
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

    // Verify admin access
    const adminEmails = ['admin@iwc.com', 'samuel.watho@gmail.com'];
    let isAdmin = adminEmails.includes(user.email || '');

    if (!isAdmin) {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      isAdmin = roles?.some(r => r.role === 'admin') || false;
    }

    if (!isAdmin) {
      throw new Error('Administrative access required');
    }

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

// User profile management with security
export const getUserProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    console.log('Fetching user profile for:', user.id);

    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('section', `profile_${user.id}`)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
    
    const profile = data ? JSON.parse(data.content) : null;
    console.log('User profile fetched:', !!profile);
    return profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

export const updateUserProfile = async (profileData: {
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  avatar_url?: string;
  bio?: string;
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    // Sanitize all string inputs
    const sanitizedData = {
      first_name: profileData.first_name ? SecurityService.sanitizeInput(profileData.first_name) : '',
      last_name: profileData.last_name ? SecurityService.sanitizeInput(profileData.last_name) : '',
      phone: profileData.phone ? SecurityService.sanitizeInput(profileData.phone) : '',
      date_of_birth: profileData.date_of_birth,
      address: profileData.address ? SecurityService.sanitizeInput(profileData.address) : '',
      avatar_url: profileData.avatar_url,
      bio: profileData.bio ? SecurityService.sanitizeInput(profileData.bio) : ''
    };

    console.log('Updating user profile for:', user.id, sanitizedData);

    const { data, error } = await supabase
      .from('site_content')
      .upsert([{
        section: `profile_${user.id}`,
        content: JSON.stringify({
          ...sanitizedData,
          updated_at: new Date().toISOString()
        }),
        updated_at: new Date().toISOString()
      }])
      .select();
    
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    
    console.log('Profile updated successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error };
  }
};
