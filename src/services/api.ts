
import { supabase } from '@/integrations/supabase/client';

export class APIError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'APIError';
  }
}

// User-related API calls
export const userAPI = {
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw new APIError(error.message);
    return user;
  },

  async getUserRoles(userId: string) {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    
    if (error) throw new APIError(error.message);
    return data?.map(r => r.role) || [];
  },

  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('section', `profile_${userId}`)
      .maybeSingle();
    
    if (error) throw new APIError(error.message);
    return data ? JSON.parse(data.content) : null;
  },

  async updateUserProfile(userId: string, profileData: any) {
    const { data, error } = await supabase
      .from('site_content')
      .upsert([{
        section: `profile_${userId}`,
        content: JSON.stringify({
          ...profileData,
          updated_at: new Date().toISOString()
        }),
        updated_at: new Date().toISOString()
      }])
      .select();
    
    if (error) throw new APIError(error.message);
    return data;
  }
};

// Donation-related API calls
export const donationAPI = {
  async createDonation(donationData: {
    amount: number;
    donation_type: string;
    payment_method?: string;
    transaction_reference?: string;
    notes?: string;
  }) {
    const user = await userAPI.getCurrentUser();
    if (!user) throw new APIError('User not authenticated');

    const { data, error } = await supabase
      .from('donations')
      .insert([{
        user_id: user.id,
        ...donationData,
      }])
      .select();
    
    if (error) throw new APIError(error.message);
    return data[0];
  },

  async getUserDonations() {
    const user = await userAPI.getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw new APIError(error.message);
    return data || [];
  },

  async getAllDonations() {
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        user_email:get_user_email(user_id)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw new APIError(error.message);
    return data || [];
  }
};

// Appreciation-related API calls
export const appreciationAPI = {
  async sendAppreciation(donationId: string, recipientId: string, message: string) {
    const user = await userAPI.getCurrentUser();
    if (!user) throw new APIError('User not authenticated');

    const { data, error } = await supabase
      .from('appreciations')
      .insert([{
        donation_id: donationId,
        sender_id: user.id,
        recipient_id: recipientId,
        message
      }])
      .select();
    
    if (error) throw new APIError(error.message);
    return data[0];
  },

  async getUserAppreciations() {
    const user = await userAPI.getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('appreciations')
      .select(`
        *,
        donations!appreciations_donation_id_fkey(amount, donation_type, created_at)
      `)
      .eq('recipient_id', user.id)
      .order('sent_at', { ascending: false });
    
    if (error) throw new APIError(error.message);
    return data || [];
  },

  async markAppreciationAsRead(appreciationId: string) {
    const { error } = await supabase
      .from('appreciations')
      .update({ read_at: new Date().toISOString() })
      .eq('id', appreciationId);
    
    if (error) throw new APIError(error.message);
  }
};

// Admin-related API calls
export const adminAPI = {
  async getContactSubmissions() {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('submitted_at', { ascending: false });
    
    if (error) throw new APIError(error.message);
    return data || [];
  },

  async getNewsletterSubscribers() {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });
    
    if (error) throw new APIError(error.message);
    return data || [];
  },

  async getEventRegistrations() {
    const { data, error } = await supabase
      .from('event_registrations')
      .select(`
        *,
        events(title, event_date)
      `)
      .order('registered_at', { ascending: false });
    
    if (error) throw new APIError(error.message);
    return data || [];
  }
};
