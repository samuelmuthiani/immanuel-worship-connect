
// Fully Supabase-integrated storage utilities
import { supabase } from '@/integrations/supabase/client';

// Contact form submission (now fully Supabase)
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

// Prayer request submission (temporarily using contact_submissions table)
export const savePrayerRequest = async (requestData: {
  name: string;
  email?: string;
  phone?: string;
  request: string;
  is_public?: boolean;
}) => {
  try {
    const { error } = await supabase
      .from('contact_submissions')
      .insert([{
        name: requestData.name,
        email: requestData.email || '',
        subject: 'Prayer Request',
        message: requestData.request,
        submitted_at: new Date().toISOString()
      }]);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error saving prayer request:', error);
    return { success: false, error };
  }
};

// RSVP storage (now fully Supabase)
export const saveRSVP = async (eventId: string, rsvpData: {
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

// Get all RSVPs for admin
export const getAllRSVPs = async () => {
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
    console.error('Error fetching RSVPs:', error);
    return [];
  }
};

// Profile management utilities (temporarily using site_content until types update)
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

    // Store profile data as JSON in site_content temporarily
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

// Get user profile
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

// Donation utilities (temporarily using site_content until types update)
export const saveDonation = async (donationData: {
  amount: number;
  donation_type: string;
  payment_method?: string;
  transaction_reference?: string;
  notes?: string;
  is_anonymous?: boolean;
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Store donation data as JSON in site_content temporarily
    const donationId = crypto.randomUUID();
    const { error } = await supabase
      .from('site_content')
      .insert([{
        section: `donation_${donationId}`,
        content: JSON.stringify({
          user_id: user.id,
          ...donationData,
          donated_at: new Date().toISOString()
        }),
        updated_at: new Date().toISOString()
      }]);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error saving donation:', error);
    return { success: false, error };
  }
};

// Get user donations
export const getUserDonations = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .like('section', 'donation_%');
    
    if (error) throw error;
    
    // Filter donations for current user
    const donations = (data || [])
      .map(item => JSON.parse(item.content))
      .filter(donation => donation.user_id === user.id)
      .sort((a, b) => new Date(b.donated_at).getTime() - new Date(a.donated_at).getTime());
    
    return donations;
  } catch (error) {
    console.error('Error fetching donations:', error);
    return [];
  }
};

// Legacy localStorage functions (kept for backward compatibility)
export const saveToLocalStorage = (key: string, value: any): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue) as T;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return defaultValue;
  }
};

// Terms and privacy acceptance (can remain localStorage for non-critical data)
export const saveTermsAcceptance = (accepted: boolean): void => {
  saveToLocalStorage('termsAccepted', {
    accepted,
    timestamp: new Date().toISOString()
  });
};

export const getTermsAcceptance = (): { accepted: boolean; timestamp: string | null } => {
  return getFromLocalStorage<{ accepted: boolean; timestamp: string | null }>(
    'termsAccepted',
    { accepted: false, timestamp: null }
  );
};

export const savePrivacyAcceptance = (accepted: boolean): void => {
  saveToLocalStorage('privacyAccepted', {
    accepted,
    timestamp: new Date().toISOString()
  });
};

export const getPrivacyAcceptance = (): { accepted: boolean; timestamp: string | null } => {
  return getFromLocalStorage<{ accepted: boolean; timestamp: string | null }>(
    'privacyAccepted',
    { accepted: false, timestamp: null }
  );
};
