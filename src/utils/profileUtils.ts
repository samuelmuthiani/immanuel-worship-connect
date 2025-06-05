
import { supabase } from '@/integrations/supabase/client';
import { SecurityService } from './security';

export interface UserProfile {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  avatar_url?: string;
  bio?: string;
  ministry?: string;
  gender?: string;
  age?: number;
  created_at?: string;
  updated_at?: string;
}

// Get user profile from profiles table (not site_content)
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    console.log('Fetching profile for user:', user.id);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
    
    console.log('User profile fetched:', !!data);
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

// Update user profile in profiles table
export const updateUserProfile = async (profileData: Partial<UserProfile>) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    // Sanitize all string inputs
    const sanitizedData: Partial<UserProfile> = {
      first_name: profileData.first_name ? SecurityService.sanitizeInput(profileData.first_name) : undefined,
      last_name: profileData.last_name ? SecurityService.sanitizeInput(profileData.last_name) : undefined,
      phone: profileData.phone ? SecurityService.sanitizeInput(profileData.phone) : undefined,
      date_of_birth: profileData.date_of_birth,
      address: profileData.address ? SecurityService.sanitizeInput(profileData.address) : undefined,
      avatar_url: profileData.avatar_url,
      bio: profileData.bio ? SecurityService.sanitizeInput(profileData.bio) : undefined,
      ministry: profileData.ministry ? SecurityService.sanitizeInput(profileData.ministry) : undefined,
      gender: profileData.gender ? SecurityService.sanitizeInput(profileData.gender) : undefined,
      age: profileData.age,
      updated_at: new Date().toISOString()
    };

    // Remove undefined values
    const cleanData = Object.fromEntries(
      Object.entries(sanitizedData).filter(([_, value]) => value !== undefined)
    );

    console.log('Updating user profile for:', user.id, cleanData);

    const { data, error } = await supabase
      .from('profiles')
      .update(cleanData)
      .eq('id', user.id)
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

// Get all profiles for admin
export const getAllProfiles = async (): Promise<UserProfile[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    // Verify admin access
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
      throw new Error('Administrative access required');
    }

    console.log('Fetching all profiles for admin...');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }
    
    console.log('All profiles fetched:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
};
