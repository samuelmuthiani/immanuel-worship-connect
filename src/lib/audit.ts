import { supabase } from '@/integrations/supabase/client';

export async function logAudit(userId: string, action: string, details?: string) {
  await supabase.from('audit_logs').insert([
    {
      user_id: userId,
      action,
      details: details || null,
      created_at: new Date().toISOString(),
    },
  ]);
}
