import { supabase } from '@/integrations/supabase/client';

// Fetch all users with the 'member' role and their profile info
export const getAllMembersWithProfile = async () => {
  // 1. Get all user_ids with 'member' role
  const { data: roles, error: rolesError } = await supabase
    .from('user_roles')
    .select('user_id')
    .eq('role', 'member');

  if (rolesError) throw rolesError;
  if (!roles || roles.length === 0) return [];

  const userIds = roles.map(r => r.user_id);

  // 2. Get user emails from auth.users (via RPC or admin API)
  // Supabase client-side cannot select from auth.users directly, so use get_user_email function or join with donations
  // We'll fetch emails via the donations table if available, otherwise fallback to user_id

  // 3. Get profile data from profiles table
  // We'll fetch profile for each user_id
  const profiles = await Promise.all(userIds.map(async (user_id) => {
    // Try to get email via a donation (if any)
    const { data: donation } = await supabase
      .from('donations')
      .select('user_email:get_user_email(user_id)')
      .eq('user_id', user_id)
      .limit(1)
      .maybeSingle();
    const email = donation?.user_email || null;

    // Get profile from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .maybeSingle();

    return {
      user_id,
      email,
      profile,
    };
  }));

  return profiles;
};
