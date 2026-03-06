# IMMANUEL WORSHIP CONNECT — SECURITY & SYSTEM IMPROVEMENT REPORT

**Date:** March 6, 2026  
**Scope:** Full codebase analysis, debugging, UI/UX, security hardening, architecture, dependencies, and performance.

---

## 1. BUGS IDENTIFIED AND FIXES IMPLEMENTED

### 1.1 Build Errors in `eventUtils.ts`
- **Root Cause:** `supabase.rpc('get_event_registration_counts')` referenced a DB function that didn't exist, and TypeScript rejected the unknown function name.
- **Fix:** Created the `get_event_registration_counts` SECURITY DEFINER function in the database. Used type cast to bypass generated type restrictions.

### 1.2 ALL RLS Policies Were RESTRICTIVE (Critical)
- **Root Cause:** All policies across 14 tables were RESTRICTIVE, causing combined evaluation to DENY access even when individual policies should have allowed it.
- **Fix:** Dropped and recreated ALL policies as PERMISSIVE with explicit role targets.

### 1.3 Event Registration Duplicate Check Failed for Guests
- **Root Cause:** Pre-insert SELECT check required permissions guests don't have.
- **Fix:** Added DB-level `UNIQUE (event_id, email)` constraint. Replaced pre-check with blind insert catching `23505` errors.

### 1.4 Newsletter `consent_status` Column Missing
- **Root Cause:** Frontend inserted `consent_status: 'granted'` but column didn't exist.
- **Fix:** Added `consent_status text DEFAULT 'granted'` column.

### 1.5 Newsletter Email Uniqueness Not Enforced
- **Fix:** Added `UNIQUE (email)` constraint on `newsletter_subscribers`.

---

## 2. DATABASE SCHEMA CHANGES

| Table | Change |
|-------|--------|
| `newsletter_subscribers` | Added `consent_status text DEFAULT 'granted'` |
| `newsletter_subscribers` | Added `UNIQUE (email)` constraint |
| `event_registrations` | Added `UNIQUE (event_id, email)` constraint |
| New function | `get_event_registration_counts(uuid[])` — SECURITY DEFINER |

---

## 3. SUPABASE RLS POLICY CHANGES

All 14 tables had policies dropped and recreated as PERMISSIVE:
- `appreciations`, `audit_logs`, `contact_submissions`, `donations`
- `event_registrations`, `events`, `media_photos`, `media_videos`
- `newsletter_subscribers`, `policy_acceptances`, `posts`, `profiles`
- `sermons`, `user_roles`

Public INSERT policies use `TO anon, authenticated` for guest-accessible forms.
Admin access gated by `has_role(auth.uid(), 'admin')`.

---

## 4. SECURITY IMPROVEMENTS

| Area | Status |
|------|--------|
| RLS Policies | ✅ All PERMISSIVE with correct role targets |
| Public Inserts | ✅ Blind insert pattern (no SELECT after INSERT) |
| Event Counts | ✅ SECURITY DEFINER function (no direct SELECT) |
| Unique Constraints | ✅ DB-level duplicate prevention |
| Input Sanitization | ✅ SecurityService used on all form inputs |
| Rate Limiting | ✅ Client-side on auth, contact, newsletter, registration |
| Session Management | ✅ Supabase auth with token refresh |
| CSP Headers | ✅ Configured in vercel.json |
| HTTPS | ✅ HSTS headers configured |
| No Vulnerabilities | ✅ npm audit clean |

---

## 5. DEPENDENCY CHANGES

| Package | Action | Reason |
|---------|--------|--------|
| `dotenv` | Removed | Vite handles env vars natively |
| `react-icons` | Removed | Unused — project uses lucide-react |

---

## 6. FILES MODIFIED

- `src/utils/eventUtils.ts` — Fixed RPC call, blind insert, duplicate handling
- `supabase/migrations/` — Schema + RLS policy overhaul migration

---

## 7. REMAINING RISKS & NEXT STEPS

1. **Enable Leaked Password Protection** — Supabase Dashboard → Auth → Settings
2. **Set Production Site URL** — Auth → URL Configuration
3. **Add Production Redirect URLs** — `https://yourdomain.com/**`
4. **Server-side Rate Limiting** — Consider Edge Function validation for public forms
5. **CAPTCHA** — Add to public forms to prevent bot abuse
6. **Review CSP** — Update as new integrations are added
