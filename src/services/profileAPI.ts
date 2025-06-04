
import { supabase } from '@/integrations/supabase/client';
import { SecurityService } from '@/utils/security';

export class ProfileAPIError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ProfileAPIError';
  }
}

// Get current authenticated user
const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new ProfileAPIError(error.message);
  if (!user) throw new ProfileAPIError('User not authenticated');
  return user;
};

// Create or update user profile using site_content as fallback until profiles table is recognized
export const upsertUserProfile = async (profileData: {
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  avatar_url?: string;
  bio?: string;
}) => {
  try {
    const user = await getCurrentUser();

    // Sanitize inputs
    const sanitizedData = {
      id: user.id,
      email: user.email,
      first_name: profileData.first_name ? SecurityService.sanitizeInput(profileData.first_name) : null,
      last_name: profileData.last_name ? SecurityService.sanitizeInput(profileData.last_name) : null,
      phone: profileData.phone ? SecurityService.sanitizeInput(profileData.phone) : null,
      date_of_birth: profileData.date_of_birth || null,
      address: profileData.address ? SecurityService.sanitizeInput(profileData.address) : null,
      avatar_url: profileData.avatar_url || null,
      bio: profileData.bio ? SecurityService.sanitizeInput(profileData.bio) : null,
      updated_at: new Date().toISOString()
    };

    // Use site_content table as fallback until profiles table types are updated
    const { data, error } = await supabase
      .from('site_content')
      .upsert([{
        section: `profile_${user.id}`,
        content: JSON.stringify(sanitizedData),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) throw new ProfileAPIError(error.message);
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const user = await getCurrentUser();

    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('section', `profile_${user.id}`)
      .maybeSingle();

    if (error) throw new ProfileAPIError(error.message);
    return data ? JSON.parse(data.content) : null;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

// Get all profiles (admin only) - using site_content for now
export const getAllProfiles = async () => {
  try {
    const user = await getCurrentUser();
    
    // Check admin access
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
      throw new ProfileAPIError('Administrative access required');
    }

    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .like('section', 'profile_%')
      .order('updated_at', { ascending: false });

    if (error) throw new ProfileAPIError(error.message);
    
    // Parse the JSON content for each profile
    const profiles = data?.map(item => {
      try {
        return JSON.parse(item.content);
      } catch {
        return null;
      }
    }).filter(Boolean) || [];

    return profiles;
  } catch (error) {
    console.error('Error fetching all profiles:', error);
    return [];
  }
};

// Update last login timestamp
export const updateLastLogin = async () => {
  try {
    const user = await getCurrentUser();

    // Get existing profile first
    const existingProfile = await getUserProfile();
    
    const updatedProfile = {
      ...existingProfile,
      last_login: new Date().toISOString()
    };

    const { error } = await supabase
      .from('site_content')
      .upsert([{
        section: `profile_${user.id}`,
        content: JSON.stringify(updatedProfile),
        updated_at: new Date().toISOString()
      }]);

    if (error) throw new ProfileAPIError(error.message);
    return { success: true };
  } catch (error) {
    console.error('Error updating last login:', error);
    return { success: false };
  }
};
