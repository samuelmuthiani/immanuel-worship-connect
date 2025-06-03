
import { supabase } from '@/integrations/supabase/client';
import { SecurityService } from '@/utils/security';

export class APIError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'APIError';
  }
}

// Base API service with security checks
class BaseAPIService {
  protected static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw new APIError(error.message);
    if (!user) throw new APIError('User not authenticated');
    return user;
  }

  protected static async validateUserOwnership(resourceUserId: string) {
    const user = await this.getCurrentUser();
    if (!SecurityService.validateUserOwnership(user.id, resourceUserId)) {
      throw new APIError('Unauthorized access to resource');
    }
    return user;
  }

  protected static validateInput(input: any, rules: Record<string, (value: any) => boolean>) {
    for (const [field, validator] of Object.entries(rules)) {
      if (!validator(input[field])) {
        throw new APIError(`Invalid ${field}`);
      }
    }
  }
}

// User-related API calls with enhanced security
export const userAPI = {
  async getCurrentUser() {
    return BaseAPIService.getCurrentUser();
  },

  async getUserRoles(userId: string) {
    // Validate user can access these roles
    const currentUser = await BaseAPIService.getCurrentUser();
    
    // Users can only see their own roles unless they're admin
    if (currentUser.id !== userId) {
      const { data: adminRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', currentUser.id);
      
      const isAdmin = adminRoles?.some(r => r.role === 'admin') || false;
      if (!isAdmin) {
        throw new APIError('Unauthorized access to user roles');
      }
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    
    if (error) throw new APIError(error.message);
    return data?.map(r => r.role) || [];
  },

  async getUserProfile(userId: string) {
    // Validate ownership
    await BaseAPIService.validateUserOwnership(userId);

    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('section', `profile_${userId}`)
      .maybeSingle();
    
    if (error) throw new APIError(error.message);
    return data ? JSON.parse(data.content) : null;
  },

  async updateUserProfile(userId: string, profileData: any) {
    // Validate ownership
    const user = await BaseAPIService.validateUserOwnership(userId);

    // Sanitize input data
    const sanitizedData = {
      first_name: SecurityService.sanitizeInput(profileData.first_name || ''),
      last_name: SecurityService.sanitizeInput(profileData.last_name || ''),
      phone: SecurityService.sanitizeInput(profileData.phone || ''),
      bio: SecurityService.sanitizeInput(profileData.bio || ''),
      date_of_birth: profileData.date_of_birth,
      address: SecurityService.sanitizeInput(profileData.address || ''),
      avatar_url: profileData.avatar_url
    };

    const { data, error } = await supabase
      .from('site_content')
      .upsert([{
        section: `profile_${userId}`,
        content: JSON.stringify({
          ...sanitizedData,
          updated_at: new Date().toISOString()
        }),
        updated_at: new Date().toISOString()
      }])
      .select();
    
    if (error) throw new APIError(error.message);
    return data;
  }
};

// Donation-related API calls with security
export const donationAPI = {
  async createDonation(donationData: {
    amount: number;
    donation_type: string;
    payment_method?: string;
    transaction_reference?: string;
    notes?: string;
  }) {
    const user = await BaseAPIService.getCurrentUser();

    // Validate donation data
    BaseAPIService.validateInput(donationData, {
      amount: (value) => typeof value === 'number' && value > 0 && value <= 1000000,
      donation_type: (value) => typeof value === 'string' && value.length > 0 && value.length <= 50,
      notes: (value) => !value || (typeof value === 'string' && value.length <= 500)
    });

    // Sanitize string inputs
    const sanitizedData = {
      ...donationData,
      donation_type: SecurityService.sanitizeInput(donationData.donation_type),
      payment_method: donationData.payment_method ? SecurityService.sanitizeInput(donationData.payment_method) : null,
      transaction_reference: donationData.transaction_reference ? SecurityService.sanitizeInput(donationData.transaction_reference) : null,
      notes: donationData.notes ? SecurityService.sanitizeInput(donationData.notes) : null
    };

    const { data, error } = await supabase
      .from('donations')
      .insert([{
        user_id: user.id,
        ...sanitizedData,
      }])
      .select();
    
    if (error) throw new APIError(error.message);
    return data[0];
  },

  async getUserDonations() {
    const user = await BaseAPIService.getCurrentUser();

    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw new APIError(error.message);
    return data || [];
  },

  async getAllDonations() {
    const user = await BaseAPIService.getCurrentUser();
    
    // Check admin privileges
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);
    
    const isAdmin = roles?.some(r => r.role === 'admin') || 
      ['admin@iwc.com', 'samuel.watho@gmail.com'].includes(user.email || '');
    
    if (!isAdmin) {
      throw new APIError('Unauthorized access to all donations');
    }

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

// Appreciation-related API calls with security
export const appreciationAPI = {
  async sendAppreciation(donationId: string, recipientId: string, message: string) {
    const user = await BaseAPIService.getCurrentUser();

    // Validate inputs
    BaseAPIService.validateInput({ donationId, recipientId, message }, {
      donationId: (value) => typeof value === 'string' && value.length > 0,
      recipientId: (value) => typeof value === 'string' && value.length > 0,
      message: (value) => typeof value === 'string' && value.length > 0 && value.length <= 1000
    });

    const sanitizedMessage = SecurityService.sanitizeInput(message);

    const { data, error } = await supabase
      .from('appreciations')
      .insert([{
        donation_id: donationId,
        sender_id: user.id,
        recipient_id: recipientId,
        message: sanitizedMessage
      }])
      .select();
    
    if (error) throw new APIError(error.message);
    return data[0];
  },

  async getUserAppreciations() {
    const user = await BaseAPIService.getCurrentUser();

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
    const user = await BaseAPIService.getCurrentUser();

    // Verify ownership of the appreciation
    const { data: appreciation, error: fetchError } = await supabase
      .from('appreciations')
      .select('recipient_id')
      .eq('id', appreciationId)
      .single();

    if (fetchError) throw new APIError(fetchError.message);
    if (appreciation.recipient_id !== user.id) {
      throw new APIError('Unauthorized access to appreciation');
    }

    const { error } = await supabase
      .from('appreciations')
      .update({ read_at: new Date().toISOString() })
      .eq('id', appreciationId);
    
    if (error) throw new APIError(error.message);
  }
};

// Admin-related API calls with enhanced security
export const adminAPI = {
  async verifyAdminAccess() {
    const user = await BaseAPIService.getCurrentUser();
    
    const adminEmails = ['admin@iwc.com', 'samuel.watho@gmail.com'];
    if (adminEmails.includes(user.email || '')) {
      return true;
    }

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);
    
    const isAdmin = roles?.some(r => r.role === 'admin') || false;
    if (!isAdmin) {
      throw new APIError('Administrative access required');
    }
    
    return true;
  },

  async getContactSubmissions() {
    await this.verifyAdminAccess();

    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('submitted_at', { ascending: false });
    
    if (error) throw new APIError(error.message);
    return data || [];
  },

  async getNewsletterSubscribers() {
    await this.verifyAdminAccess();

    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('subscribed_at', { ascending: false });
    
    if (error) throw new APIError(error.message);
    return data || [];
  },

  async getEventRegistrations() {
    await this.verifyAdminAccess();

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
