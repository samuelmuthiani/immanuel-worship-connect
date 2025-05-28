// Re-export the main utilities from the new modular files
export {
  saveContactSubmission,
  saveEventRSVP as saveRSVP,
  saveNewsletterSubscription,
  getUserProfile,
  updateUserProfile,
  getAllContactSubmissions,
  getAllEventRegistrations as getAllRSVPs,
  getAllNewsletterSubscribers
} from './supabaseStorage';

export {
  exportToCSV,
  getDashboardAnalytics,
  bulkDeleteItems,
  updateUserRole,
  logAuditAction
} from './adminUtils';

// Keep legacy localStorage functions for backward compatibility
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

// Terms and privacy acceptance (non-critical data can remain localStorage)
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

// Donation utilities (using Supabase)
export const saveDonation = async (donationData: {
  amount: number;
  donation_type: string;
  payment_method?: string;
  transaction_reference?: string;
  notes?: string;
  is_anonymous?: boolean;
}) => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

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

export const getUserDonations = async () => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .like('section', 'donation_%');
    
    if (error) throw error;
    
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
