
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
  last_login?: string;
}

// Get user profile from profiles table
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
    
    // If no profile exists, create one
    if (!data) {
      console.log('No profile found, creating new profile...');
      const newProfile = {
        id: user.id,
        email: user.email,
        first_name: '',
        last_name: '',
        created_at: new Date().toISOString()
      };
      
      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating profile:', createError);
        return null;
      }
      
      console.log('New profile created:', createdProfile);
      return createdProfile;
    }
    
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

// Get all profiles for admin (enhanced with better error handling)
export const getAllProfiles = async (): Promise<UserProfile[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

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
