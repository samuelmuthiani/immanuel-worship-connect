import { supabasePromise } from './integrations/supabase/client';

async function testConnection() {
  const supabase = await supabasePromise;
  const { data, error } = await supabase.from('donations').select('*').limit(1);
  if (error) {
    console.error('Supabase connection error:', error);
  } else {
    console.log('Supabase connection successful! Sample data:', data);
  }
}

testConnection();
