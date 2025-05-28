
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
    const { error } = await supabase
      .from('contact_submissions')
      .insert([{
        ...formData,
        submitted_at: new Date().toISOString()
      }]);
    
    if (error) throw error;
    return { success: true };
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
    const { error } = await supabase
      .from('event_registrations')
      .insert([{
        event_id: eventId,
        ...rsvpData,
        registered_at: new Date().toISOString()
      }]);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error saving RSVP:', error);
    return { success: false, error };
  }
};

// Newsletter subscription
export const saveNewsletterSubscription = async (email: string) => {
  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{
        email,
        subscribed_at: new Date().toISOString()
      }]);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error saving newsletter subscription:', error);
    return { success: false, error };
  }
};

// Admin functions
export const getAllContactSubmissions = async () => {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('submitted_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    return [];
  }
};

export const getAllEventRegistrations = async () => {
  try {
    const { data, error } = await supabase
      .from('event_registrations')
      .select(`
        *,
        events(title, event_date)
      `)
      .order('registered_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    return [];
  }
};

export const getAllNewsletterSubscribers = async () => {
  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });
    
    if (error) throw error;
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

    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('section', `profile_${user.id}`)
      .maybeSingle();
    
    if (error) throw error;
    return data ? JSON.parse(data.content) : null;
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

    const { error } = await supabase
      .from('site_content')
      .upsert([{
        section: `profile_${user.id}`,
        content: JSON.stringify({
          ...profileData,
          updated_at: new Date().toISOString()
        }),
        updated_at: new Date().toISOString()
      }]);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error };
  }
};
