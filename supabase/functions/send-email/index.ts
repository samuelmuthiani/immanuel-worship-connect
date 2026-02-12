
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

interface EmailRequest {
    to: string
    subject: string
    html: string
    text?: string
    from?: string
}

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        if (!RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY is not set')
        }

        const { to, subject, html, text, from }: EmailRequest = await req.json()

        // Basic validation
        if (!to || !subject || !html) {
            throw new Error('Missing required fields: to, subject, html')
        }

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: from || 'Immanuel Worship Connect <onboarding@resend.dev>', // Default testing domain
                to,
                subject,
                html,
                text: text || html.replace(/<[^>]*>?/gm, ''), // Fallback plain text
            }),
        })

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.message || 'Failed to send email')
        }

        return new Response(
            JSON.stringify(data),
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
