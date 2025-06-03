import { supabase } from '@/integrations/supabase/client';
import { sendEmail } from './sendEmail';

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
  status?: 'pending' | 'verified' | 'rejected';
  verified_by?: string | null;
  verified_at?: string | null;
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

    // 1. Get the donation to find the recipient user_id
    const { data: donation, error: donationError } = await supabase
      .from('donations')
      .select('user_id')
      .eq('id', donationId)
      .single();

    if (donationError) throw donationError;

    // 2. Get the recipient's email from auth.users
    let recipientEmail = null;
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(donation.user_id);
    if (userError) {
      console.error('Could not fetch recipient email:', userError);
    } else {
      recipientEmail = userData?.user?.email;
    }

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

    // Send email notification to donor
    if (recipientEmail) {
      try {
        await sendEmail({
          to: recipientEmail,
          subject: 'Thank You for Your Donation',
          html: `<p>Dear friend,</p><p>Thank you for your generous donation! Here is a message from our team:</p><blockquote>${message}</blockquote><p>Blessings,<br/>Immanuel Worship Connect</p>`
        });
      } catch (emailError) {
        // Log but do not fail the appreciation if email fails
        console.error('Failed to send appreciation email:', emailError);
      }
    }

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

// Admin: Update donation status
export const updateDonationStatus = async (
  donationId: string,
  status: 'pending' | 'verified' | 'rejected',
  adminUserId: string
) => {
  try {
    const { data, error } = await supabase
      .from('donations')
      .update({
        status,
        verified_by: status === 'verified' ? adminUserId : null,
        verified_at: status === 'verified' ? new Date().toISOString() : null,
      })
      .eq('id', donationId)
      .select();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating donation status:', error);
    return { success: false, error };
  }
};
