
import { supabase } from '@/integrations/supabase/client';

export interface Donation {
  id: string;
  user_id: string;
  amount: number;
  donation_type: string;
  payment_method?: string;
  transaction_reference?: string;
  notes?: string;
  created_at: string;
  user_email?: string;
}

export interface Appreciation {
  id: string;
  donation_id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  sent_at: string;
  read_at?: string;
  donation?: Donation;
}

// Save a donation
export const saveDonation = async (donationData: {
  amount: number;
  donation_type: string;
  payment_method?: string;
  transaction_reference?: string;
  notes?: string;
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('donations')
      .insert([{
        user_id: user.id,
        ...donationData
      }])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error saving donation:', error);
    return { success: false, error };
  }
};

// Get all donations (admin only)
export const getAllDonations = async () => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        user_email:get_user_email(user_id)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching donations:', error);
    return [];
  }
};

// Get user's own donations
export const getUserDonations = async () => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user donations:', error);
    return [];
  }
};

// Send appreciation message
export const sendAppreciation = async (donationId: string, message: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get the donation to find the recipient
    const { data: donation, error: donationError } = await supabase
      .from('donations')
      .select('user_id')
      .eq('id', donationId)
      .single();

    if (donationError) throw donationError;

    const { data, error } = await supabase
      .from('appreciations')
      .insert([{
        donation_id: donationId,
        sender_id: user.id,
        recipient_id: donation.user_id,
        message
      }])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error sending appreciation:', error);
    return { success: false, error };
  }
};

// Get appreciations for current user
export const getUserAppreciations = async () => {
  try {
    const { data, error } = await supabase
      .from('appreciations')
      .select(`
        *,
        donation:donations(*)
      `)
      .order('sent_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching appreciations:', error);
    return [];
  }
};

// Mark appreciation as read
export const markAppreciationAsRead = async (appreciationId: string) => {
  try {
    const { error } = await supabase
      .from('appreciations')
      .update({ read_at: new Date().toISOString() })
      .eq('id', appreciationId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error marking appreciation as read:', error);
    return { success: false, error };
  }
};
