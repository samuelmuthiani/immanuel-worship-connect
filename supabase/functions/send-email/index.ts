
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { getCorsHeaders } from '../_shared/cors.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

interface EmailRequest {
    to: string
    subject: string
    html: string
    text?: string
}

serve(async (req) => {
    const cors = getCorsHeaders(req);

    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: cors })
    }

    try {
        if (!RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY is not set')
        }

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
        if (authError || !user) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401, headers: { ...cors, "Content-Type": "application/json" } }
            )
        }

        const body: EmailRequest = await req.json()
        const { to, subject, html, text } = body

        if (!to || !subject || !html) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: to, subject, html' }),
                { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
            )
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(to)) {
            return new Response(
                JSON.stringify({ error: 'Invalid email address' }),
                { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
            )
        }

        if (subject.length > 200) {
            return new Response(
                JSON.stringify({ error: 'Subject must be 200 characters or less' }),
                { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
            )
        }

        if (html.length > 100_000) {
            return new Response(
                JSON.stringify({ error: 'HTML content too large' }),
                { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
            )
        }

        if (/[\r\n]/.test(subject)) {
            return new Response(
                JSON.stringify({ error: 'Invalid characters in subject' }),
                { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
            )
        }

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'Immanuel Worship Connect <onboarding@resend.dev>',
                to,
                subject,
                html,
                text: text || html.replace(/<[^>]*>?/gm, ''),
            }),
        })

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.message || 'Failed to send email')
        }

        return new Response(
            JSON.stringify(data),
            { headers: { ...cors, "Content-Type": "application/json" } },
        )
    } catch (error: unknown) {
        return new Response(
            JSON.stringify({ error: 'An error occurred while sending the email' }),
            {
                status: 500,
                headers: { ...getCorsHeaders(req), "Content-Type": "application/json" }
            },
        )
    }
})
