import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { getCorsHeaders } from "../_shared/cors.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? ""
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

serve(async (req) => {
  const cors = getCorsHeaders(req)

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors })
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...cors, "Content-Type": "application/json" }
    })
  }

  try {
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" }
      })
    }

    const body = await req.json()
    const { email, name, source_page } = body ?? {}

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email address" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" }
      })
    }

    if (name && typeof name !== "string") {
      return new Response(JSON.stringify({ error: "Invalid name" }), {
        status: 400,
        headers: { ...cors, "Content-Type": "application/json" }
      })
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown"
    const userAgent = req.headers.get("user-agent")?.slice(0, 200) || null

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count: recentCount, error: rateError } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("id", { count: "exact", head: true })
      .eq("ip_address", ip)
      .gte("created_at", oneHourAgo)

    if (rateError) {
      return new Response(JSON.stringify({ error: "Unable to process request" }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" }
      })
    }

    if ((recentCount || 0) >= 5) {
      return new Response(JSON.stringify({ error: "Too many attempts. Please try again later." }), {
        status: 429,
        headers: { ...cors, "Content-Type": "application/json" }
      })
    }

    const sanitizedEmail = email.trim().toLowerCase()
    const sanitizedName = typeof name === "string" ? name.trim().slice(0, 120) : null
    const sourcePage = typeof source_page === "string" ? source_page.trim().slice(0, 200) : null

    const { error: insertError } = await supabaseAdmin
      .from("newsletter_subscribers")
      .insert([{
        email: sanitizedEmail,
        name: sanitizedName,
        consent: true,
        consent_status: "granted",
        created_at: new Date().toISOString(),
        subscribed_at: new Date().toISOString(),
        source_page: sourcePage,
        ip_address: ip
      }])

    if (insertError) {
      if (insertError.code === "23505") {
        const { error: updateError } = await supabaseAdmin
          .from("newsletter_subscribers")
          .update({
            name: sanitizedName,
            consent: true,
            consent_status: "granted",
            source_page: sourcePage,
            ip_address: ip
          })
          .eq("email", sanitizedEmail)
        if (updateError) {
          return new Response(JSON.stringify({ error: "Failed to update subscription" }), {
            status: 500,
            headers: { ...cors, "Content-Type": "application/json" }
          })
        }
      } else {
        return new Response(JSON.stringify({ error: "Failed to subscribe" }), {
          status: 500,
          headers: { ...cors, "Content-Type": "application/json" }
        })
      }
    }

    await supabaseAdmin.from("consent_records").insert([{
      email: sanitizedEmail,
      consent_type: "newsletter",
      status: "granted",
      accepted_at: new Date().toISOString(),
      ip_address: ip,
      user_agent: userAgent
    }])

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ success: true, emailSent: false }), {
        status: 200,
        headers: { ...cors, "Content-Type": "application/json" }
      })
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: "Immanuel Worship Connect <onboarding@resend.dev>",
        to: sanitizedEmail,
        subject: "You’re subscribed to Immanuel Worship Connect",
        html: `<div style="font-family:Arial,sans-serif;line-height:1.5">
          <h2>Welcome to Immanuel Worship Connect</h2>
          <p>Thanks for subscribing${sanitizedName ? `, ${sanitizedName}` : ""}. You’ll receive updates on events, services, and community news.</p>
          <p>If you didn’t request this, you can ignore this message.</p>
        </div>`
      })
    })

    if (!res.ok) {
      return new Response(JSON.stringify({ success: true, emailSent: false }), {
        status: 200,
        headers: { ...cors, "Content-Type": "application/json" }
      })
    }

    return new Response(JSON.stringify({ success: true, emailSent: true }), {
      status: 200,
      headers: { ...cors, "Content-Type": "application/json" }
    })
  } catch {
    return new Response(JSON.stringify({ error: "Unable to process request" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" }
    })
  }
})
