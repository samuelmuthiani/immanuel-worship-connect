
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export type Donation = Database['public']['Tables']['donations']['Row'];
type DonationInsert = Database['public']['Tables']['donations']['Insert'];
export type Appreciation = Database['public']['Tables']['appreciations']['Row'];
type AppreciationInsert = Database['public']['Tables']['appreciations']['Insert'];

// Extended type for donation with user email
export type DonationWithEmail = Donation & {
  user_email?: string;
};

// Extended type for appreciation with donation details
export type AppreciationWithDonation = Appreciation & {
  donations?: {
    amount: number;
    donation_type: string | null;
    created_at: string;
  };
};

export const donationService = {
  // Create a new donation record
  async createDonation(donationData: Omit<DonationInsert, 'id' | 'created_at'>): Promise<Donation | null> {
    try {
      const { data, error } = await supabase
        .from('donations')
        .insert(donationData)
        .select()
        .single();

      if (error) {
        console.error('Error creating donation:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to create donation:', error);
      return null;
    }
  },

  // Get all donations for a specific user
  async getUserDonations(userId: string): Promise<Donation[]> {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user donations:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch user donations:', error);
      return [];
    }
  },

  // Get all donations with user emails (admin only)
  async getAllDonationsWithUserInfo(): Promise<DonationWithEmail[]> {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all donations:', error);
        throw error;
      }

      // Get user emails for each donation
      const donationsWithEmails = await Promise.all(
        (data || []).map(async (donation) => {
          try {
            const { data: userEmail } = await supabase.rpc('get_user_email', {
              user_uuid: donation.user_id
            });
            return { ...donation, user_email: userEmail || 'Unknown' };
          } catch {
            return { ...donation, user_email: 'Unknown' };
          }
        })
      );

      return donationsWithEmails;
    } catch (error) {
      console.error('Failed to fetch all donations:', error);
      return [];
    }
  },

  // Get all donations (admin only)
  async getAllDonations(): Promise<Donation[]> {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all donations:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch all donations:', error);
      return [];
    }
  },

  // Send appreciation message for a donation
  async sendAppreciation(appreciationData: Omit<AppreciationInsert, 'id' | 'sent_at'>): Promise<Appreciation | null> {
    try {
      const { data, error } = await supabase
        .from('appreciations')
        .insert(appreciationData)
        .select()
        .single();

      if (error) {
        console.error('Error sending appreciation:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to send appreciation:', error);
      return null;
    }
  },

  // Get appreciations for a user
  async getUserAppreciations(userId: string): Promise<AppreciationWithDonation[]> {
    try {
      const { data, error } = await supabase
        .from('appreciations')
        .select(`
          *,
          donations:donation_id (
            amount,
            donation_type,
            created_at
          )
        `)
        .eq('recipient_id', userId)
        .order('sent_at', { ascending: false });

      if (error) {
        console.error('Error fetching user appreciations:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch user appreciations:', error);
      return [];
    }
  },

  // Mark appreciation as read
  async markAppreciationAsRead(appreciationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('appreciations')
        .update({ read_at: new Date().toISOString() })
        .eq('id', appreciationId);

      if (error) {
        console.error('Error marking appreciation as read:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to mark appreciation as read:', error);
      return false;
    }
  },

  // Get donation statistics
  async getDonationStats(): Promise<{
    totalAmount: number;
    totalDonations: number;
    monthlyTotal: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('amount, created_at');

      if (error) {
        console.error('Error fetching donation stats:', error);
        throw error;
      }

      if (!data) {
        return { totalAmount: 0, totalDonations: 0, monthlyTotal: 0 };
      }

      const totalAmount = data.reduce((sum, donation) => sum + (donation.amount || 0), 0);
      const totalDonations = data.length;

      // Calculate monthly total (current month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyTotal = data
        .filter(donation => {
          const donationDate = new Date(donation.created_at);
          return donationDate.getMonth() === currentMonth && donationDate.getFullYear() === currentYear;
        })
        .reduce((sum, donation) => sum + (donation.amount || 0), 0);

      return {
        totalAmount,
        totalDonations,
        monthlyTotal,
      };
    } catch (error) {
      console.error('Failed to fetch donation stats:', error);
      return { totalAmount: 0, totalDonations: 0, monthlyTotal: 0 };
    }
  },
};

// Individual function exports for easier importing
export const getUserDonations = async (): Promise<Donation[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  return donationService.getUserDonations(user.id);
};

export const getAllDonations = async (): Promise<DonationWithEmail[]> => {
  return donationService.getAllDonationsWithUserInfo();
};

export const sendAppreciation = async (donationId: string, message: string): Promise<{ success: boolean }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: donation } = await supabase
      .from('donations')
      .select('user_id')
      .eq('id', donationId)
      .single();

    if (!donation) throw new Error('Donation not found');

    const appreciation = await donationService.sendAppreciation({
      donation_id: donationId,
      recipient_id: donation.user_id,
      sender_id: user.id,
      message,
    });

    return { success: !!appreciation };
  } catch (error) {
    console.error('Error sending appreciation:', error);
    return { success: false };
  }
};

export const getUserAppreciations = async (): Promise<AppreciationWithDonation[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  return donationService.getUserAppreciations(user.id);
};

export const markAppreciationAsRead = async (appreciationId: string): Promise<{ success: boolean }> => {
  const success = await donationService.markAppreciationAsRead(appreciationId);
  return { success };
};

export const saveDonation = async (donationData: {
  amount: number;
  donation_type: string;
  payment_method: string;
  notes: string;
}): Promise<{ success: boolean }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const donation = await donationService.createDonation({
      user_id: user.id,
      amount: donationData.amount,
      donation_type: donationData.donation_type,
      payment_method: donationData.payment_method,
      notes: donationData.notes,
    });

    return { success: !!donation };
  } catch (error) {
    console.error('Error saving donation:', error);
    return { success: false };
  }
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Helper function to get donation type display name
export const getDonationTypeDisplayName = (type: string): string => {
  const typeMap: Record<string, string> = {
    general: 'General Donation',
    tithe: 'Tithe',
    offering: 'Offering',
    building_fund: 'Building Fund',
    missions: 'Missions',
    special: 'Special Event',
  };

  return typeMap[type] || type;
};
