
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
      .eq('user_id', user.id)
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
        user_id: user.id,
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

    const sanitizeField = (value: string | undefined | null): string | null => {
      if (value === undefined || value === null) return null;
      const trimmed = value.trim();
      return trimmed ? SecurityService.sanitizeInput(trimmed) : '';
    };

    // Build update payload - include all editable fields so cleared values persist
    const updateData: Record<string, unknown> = {
      first_name: sanitizeField(profileData.first_name) ?? '',
      last_name: sanitizeField(profileData.last_name) ?? '',
      phone: sanitizeField(profileData.phone) ?? '',
      date_of_birth: profileData.date_of_birth || null,
      address: sanitizeField(profileData.address) ?? '',
      avatar_url: profileData.avatar_url || null,
      bio: sanitizeField(profileData.bio) ?? '',
      ministry: sanitizeField(profileData.ministry) ?? '',
      gender: sanitizeField(profileData.gender) ?? '',
      updated_at: new Date().toISOString()
    };

    console.log('Updating user profile for:', user.id, updateData);

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', user.id)
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
