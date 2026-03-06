
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getCorsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
    const cors = getCorsHeaders(req);

    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: cors })
    }

    try {
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

        const body = await req.json()
        const { amount, currency = 'usd', paymentMethodId } = body

        // Input validation
        if (!amount || typeof amount !== 'number' || amount <= 0 || amount > 100000000) {
            return new Response(JSON.stringify({ error: 'Invalid donation amount' }), {
                status: 400, headers: { ...cors, "Content-Type": "application/json" }
            })
        }

        if (typeof currency !== 'string' || !/^[a-z]{3}$/i.test(currency)) {
            return new Response(JSON.stringify({ error: 'Invalid currency code' }), {
                status: 400, headers: { ...cors, "Content-Type": "application/json" }
            })
        }

        // Mock payment processing (Stripe integration placeholder)
        const clientSecret = 'mock_secret_' + Math.random().toString(36).substring(7);

        // Log Donation in Database
        const { data, error } = await supabaseClient
            .from('donations')
            .insert({
                user_id: user.id,
                amount: amount / 100,
                status: 'pending',
            })
            .select()
            .single()

        if (error) throw error

        return new Response(
            JSON.stringify({ clientSecret, donationId: data.id }),
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
