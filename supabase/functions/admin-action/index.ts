
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Hello from Functions!')

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 1. Create Supabase Client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        // 2. Authenticate User
        const {
            data: { user },
        } = await supabaseClient.auth.getUser()

        if (!user) {
            throw new Error('Unauthorized')
        }

        // 3. Verify Admin Role (Database Check)
        // We create a separate client with SERVICE_ROLE_KEY to perform the check
        // because we don't trust the client-provided token to know its own role for sure if RLS is tricky,
        // although RLS should handle it. However, for "admin-action", we often need elevated privileges
        // to perform the actual action (like banning a user).

        // Admin Client (Bypass RLS)
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { data: roles } = await supabaseAdmin
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', 'admin')
            .single()

        if (!roles) {
            throw new Error('Forbidden: Admin access required')
        }

        // 4. Parse Request
        const { action, targetId, payload } = await req.json()

        // 5. Handle Actions
        let result;
        switch (action) {
            case 'ban_user':
                // Example: Update metadata to ban user
                result = await supabaseAdmin.auth.admin.updateUserById(
                    targetId,
                    { user_metadata: { banned: true } }
                )
                break;

            case 'delete_user':
                result = await supabaseAdmin.auth.admin.deleteUser(targetId)
                break;

            case 'assign_role':
                result = await supabaseAdmin
                    .from('user_roles')
                    .upsert({ user_id: targetId, role: payload.role })
                break;

            default:
                throw new Error(`Unknown action: ${action}`)
        }

        // 6. Return Result
        return new Response(
            JSON.stringify(result),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            },
        )
    }
})
