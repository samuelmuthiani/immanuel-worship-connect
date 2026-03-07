import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabaseEnvMissing = !SUPABASE_URL || !SUPABASE_ANON_KEY;
const resolvedUrl = SUPABASE_URL || 'http://localhost:54321';
const resolvedKey = SUPABASE_ANON_KEY || 'public-anon-key';

export const supabase = createClient<Database>(resolvedUrl, resolvedKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
