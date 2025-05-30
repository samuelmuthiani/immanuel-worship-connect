
// Centralized Supabase storage utilities
import { supabase } from '@/integrations/supabase/client';

// Contact form submission
export const saveContactSubmission = async (formData: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  inquiry_type?: string;
}) => {
  try {
    console.log('Saving contact submission:', formData);
    
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([{
        ...formData,
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

// Event RSVP submission
export const saveEventRSVP = async (eventId: string, rsvpData: {
  name: string;
  email: string;
  phone?: string;
}) => {
  try {
    console.log('Saving event RSVP:', { eventId, rsvpData });
    
    const { data, error } = await supabase
      .from('event_registrations')
      .insert([{
        event_id: eventId,
        ...rsvpData,
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

// Newsletter subscription
export const saveNewsletterSubscription = async (email: string) => {
  try {
    console.log('Saving newsletter subscription:', email);
    
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([{
        email: email.trim(),
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

// Admin functions
export const getAllContactSubmissions = async () => {
  try {
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

// User profile management
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
    if (!user) throw new Error('Not authenticated');

    console.log('Updating user profile for:', user.id, profileData);

    const { data, error } = await supabase
      .from('site_content')
      .upsert([{
        section: `profile_${user.id}`,
        content: JSON.stringify({
          ...profileData,
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
