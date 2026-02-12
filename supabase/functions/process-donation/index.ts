
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// import Stripe from 'https://esm.sh/stripe@12.0.0'
// const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
//   apiVersion: '2022-11-15',
// })

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const {
            data: { user },
        } = await supabaseClient.auth.getUser()

        if (!user) {
            throw new Error('Unauthorized')
        }

        const { amount, currency = 'usd', paymentMethodId } = await req.json()

        // 1. Create Payment Intent (Mock logic if key missing)
        const clientSecret = 'mock_secret_' + Math.random().toString(36).substring(7);

        // if (Deno.env.get('STRIPE_SECRET_KEY')) {
        //   const paymentIntent = await stripe.paymentIntents.create({
        //     amount: amount, // amount in cents
        //     currency: currency,
        //     payment_method: paymentMethodId,
        //     confirm: true,
        //     metadata: { userId: user.id }
        //   })
        //   clientSecret = paymentIntent.client_secret
        // }

        // 2. Log Donation in Database
        const { data, error } = await supabaseClient
            .from('donations')
            .insert({
                user_id: user.id,
                amount: amount / 100, // convert back to standard unit for DB
                currency: currency,
                status: 'pending', // or 'succeeded' if using immediate capture
                payment_intent: clientSecret
            })
            .select()
            .single()

        if (error) throw error

        return new Response(
            JSON.stringify({ clientSecret, donationId: data.id }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        )
    } catch (error: unknown) {
        return new Response(
            JSON.stringify({ error: (error instanceof Error ? error.message : String(error)) }),
            {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" }
            },
        )
    }
})
