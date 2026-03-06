
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getCorsHeaders } from '../_shared/cors.ts'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_ACTIONS = ['ban_user', 'delete_user', 'assign_role', 'register_admin'];
const VALID_ROLES = ['admin', 'moderator', 'user'];

serve(async (req) => {
    const cors = getCorsHeaders(req);

    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: cors })
    }

    try {
        // 1. Authenticate User
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const { data: { user } } = await supabaseClient.auth.getUser()
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401, headers: { ...cors, "Content-Type": "application/json" }
            })
        }

        // 2. Verify Admin Role
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
            return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
                status: 403, headers: { ...cors, "Content-Type": "application/json" }
            })
        }

        // 3. Parse & Validate Input
        const body = await req.json()
        const { action, targetId, payload } = body

        if (!action || typeof action !== 'string' || !ALLOWED_ACTIONS.includes(action)) {
            return new Response(JSON.stringify({ error: `Invalid action. Allowed: ${ALLOWED_ACTIONS.join(', ')}` }), {
                status: 400, headers: { ...cors, "Content-Type": "application/json" }
            })
        }

        if (targetId && !UUID_REGEX.test(targetId)) {
            return new Response(JSON.stringify({ error: 'Invalid targetId format (must be UUID)' }), {
                status: 400, headers: { ...cors, "Content-Type": "application/json" }
            })
        }

        // 4. Handle Actions
        let result;
        switch (action) {
            case 'ban_user': {
                if (!targetId) throw new Error('targetId is required');
                if (targetId === user.id) throw new Error('Cannot ban yourself');
                result = await supabaseAdmin.auth.admin.updateUserById(
                    targetId,
                    { user_metadata: { banned: true } }
                )
                break;
            }

            case 'delete_user': {
                if (!targetId) throw new Error('targetId is required');
                if (targetId === user.id) throw new Error('Cannot delete yourself');
                result = await supabaseAdmin.auth.admin.deleteUser(targetId)
                break;
            }

            case 'assign_role': {
                if (!targetId) throw new Error('targetId is required');
                if (!payload?.role || !VALID_ROLES.includes(payload.role)) {
                    throw new Error(`Invalid role. Allowed: ${VALID_ROLES.join(', ')}`);
                }
                result = await supabaseAdmin
                    .from('user_roles')
                    .upsert({ user_id: targetId, role: payload.role })
                break;
            }

            case 'register_admin': {
                if (!payload?.email || !EMAIL_REGEX.test(payload.email)) {
                    throw new Error('Valid email is required');
                }
                if (!payload?.password || typeof payload.password !== 'string' || payload.password.length < 8) {
                    throw new Error('Password must be at least 8 characters');
                }
                if (payload.password.length > 128) {
                    throw new Error('Password must be less than 128 characters');
                }

                const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                    email: payload.email.trim().toLowerCase(),
                    password: payload.password,
                    email_confirm: true,
                })
                if (createError) throw createError;
                if (!newUser.user) throw new Error('Failed to create user');

                const { error: roleError } = await supabaseAdmin
                    .from('user_roles')
                    .insert({ user_id: newUser.user.id, role: 'admin' })
                if (roleError) throw roleError;

                result = { data: { user_id: newUser.user.id, email: payload.email }, error: null }
                break;
            }

            default:
                throw new Error(`Unknown action: ${action}`)
        }

        return new Response(
            JSON.stringify(result),
            { headers: { ...cors, "Content-Type": "application/json" } },
        )

    } catch (error: unknown) {
        return new Response(
            JSON.stringify({ error: (error instanceof Error ? error.message : String(error)) }),
            {
                status: 400,
                headers: { ...getCorsHeaders(req), "Content-Type": "application/json" }
            },
        )
    }
})
