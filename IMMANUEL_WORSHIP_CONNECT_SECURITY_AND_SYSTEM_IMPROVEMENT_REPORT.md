# IMMANUEL WORSHIP CONNECT — SECURITY & SYSTEM IMPROVEMENT REPORT

**Date:** March 6, 2026  
**Scope:** Full codebase analysis, debugging, UI/UX, security hardening, architecture, dependencies, and performance.

---

## 1. BUGS IDENTIFIED AND FIXES IMPLEMENTED

### 1.1 Newsletter system – admin not showing full data

- **Root cause:**  
  - Newsletter table had no `consent_status`; requirements were subscriber_email, signup_timestamp, consent_status.  
  - Frontend sent only `email` and `subscribed_at`; no consent capture.  
  - Admin columns were only “Email” and “Subscribed”; no consent status.

- **Fixes:**  
  - **Migration** `20260306000001_newsletter_consent_and_event_user_id.sql`: added `consent_status` (text, default `'granted'`) to `newsletter_subscribers`.  
  - **NewsletterSignup.tsx:** Added consent checkbox; submit sends `email`, `subscribed_at`, `consent_status: 'granted'`. Sanitized email via `SecurityService.sanitizeEmail`. Rate limit: 3 attempts per email per hour.  
  - **AdminDashboard:** Newsletter columns now: “Subscriber Email”, “Subscription Timestamp”, “Consent Status”.  
  - **Communications tab:** Added stats panel: Total Subscribers, Recent (last 7 days), Consent: Granted.  
  - **Supabase types:** `newsletter_subscribers` Row/Insert/Update include `consent_status`.

### 1.2 Terms and privacy consent not stored on signup

- **Root cause:**  
  - Register page had terms/privacy checkboxes and `recordPolicyAcceptance(userId)` but never received the new user id.  
  - `AuthContext.signUp` returned only `{ success, error }`, so policy acceptances were never recorded.

- **Fixes:**  
  - **AuthContext.tsx:** `signUp` now returns `{ success, user?: User, error? }` and includes `user: data.user` on success.  
  - **Register.tsx:** After `signUp` success, if `result.user?.id` exists, calls `recordPolicyAcceptance(result.user.id)` so both terms and privacy are stored in `policy_acceptances` with `accepted_at` (default now()).  
  - Admin “Terms and Policy Acceptances” table already showed user email, policy type, accepted at; no schema change.

### 1.3 Guest event registration

- **Root cause:**  
  - Events page already allowed guest registration (name, email, phone) and `eventUtils.registerForEvent` inserted without `user_id`.  
  - Schema in some migrations had no `user_id` on `event_registrations`; types expected optional `user_id`.

- **Fixes:**  
  - **Migration:** `event_registrations` gets `user_id` UUID NULL if missing (guests = null, members = auth.uid()).  
  - **eventUtils.ts:** When user is logged in, insert includes `user_id`; duplicate check remains on `event_id` + `email`.  
  - **Events.tsx:** Attendee counts: added `get_event_registration_counts(event_ids)` (SECURITY DEFINER, returns only counts). Frontend calls `getEventRegistrationCounts(ids)` and shows “X people registered” on cards.  
  - **Copy:** Guest flow toast: “You can register with your name and email—no account required.” Modal title: “Register as Guest” when not logged in.  
  - Rate limit on event registration: 5 attempts per email per 15 minutes.

---

## 2. UI/UX IMPROVEMENTS

- **Newsletter:** Consent checkbox with clear label; error state for “Please agree to receive newsletter emails”; loading and success states unchanged.  
- **Admin – Communications:** Stats cards for newsletter (total, last 7 days, consent granted).  
- **Admin – Newsletter table:** Columns renamed to Subscriber Email, Subscription Timestamp, Consent Status.  
- **Events page:**  
  - Skeleton loading (3 placeholder cards) instead of plain “Loading events…”.  
  - Event description shown when present.  
  - Attendee count per event (“X people registered”) when registration is required.  
  - Registration modal: “Register as Guest” when not logged in; rounded card and shadow.  
- **Lazy loading:** `MemberArea` and `AdminDashboard` loaded with `React.lazy` and `<Suspense fallback={<PageLoader />}>` to reduce initial bundle and improve TTI.

---

## 3. SECURITY IMPROVEMENTS

### 3.1 Environment variables

- **Removed:** Hardcoded Supabase URL and anon key from `src/integrations/supabase/client.ts`.  
- **Added:** Use of `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY` (with fallback to `VITE_SUPABASE_PUBLISHABLE_KEY` for existing setups).  
- **Runtime check:** If either is missing, throw a clear error so no silent fallback to secrets in repo.  
- **.gitignore:** `.env`, `.env.*`, with exception `!.env.example`.  
- **.env.example:** Added with placeholders for `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

### 3.2 Input sanitization and validation

- **Newsletter:** Email via `SecurityService.sanitizeEmail`; consent required.  
- **Contact form:** Name and message via `SecurityService.sanitizeInput`, email via `SecurityService.sanitizeEmail`.  
- **Event registration:** Already using `SecurityService.sanitizeInput` for name, email, phone.  
- No raw user input written to DOM or SQL; Supabase parameterized queries used throughout.

### 3.3 Rate limiting

- **Newsletter:** 3 submissions per email per hour (in-memory).  
- **Contact form:** 5 submissions per 15 minutes (key: `contact-form`).  
- **Event registration:** 5 per email per 15 minutes.  
- **Auth:** Existing sign-in (5/15 min) and sign-up (3/15 min) limits in AuthContext retained.

### 3.4 Authentication and session

- Supabase Auth only; no custom password handling.  
- Session: `persistSession: true`, `autoRefreshToken: true`, `storage: localStorage`.  
- AuthGuard and ProtectedRoute use `SecurityService.validateSessionToken(session.access_token)` for format checks.  
- Admin routes protected by `AuthGuard adminOnly` and `hasRole('admin')`; admin service uses `ensureAdmin()` before any admin-only fetch.

### 3.5 Database and RLS

- **New function:** `get_event_registration_counts(event_ids uuid[])` – SECURITY DEFINER, returns only `(event_id, registration_count)`; granted to `anon` and `authenticated`.  
- RLS left as in latest migration (e.g. `admin_select_subscriber` for newsletter, `public_insert_subscriber` for insert; policy_acceptances and event_registrations unchanged).  
- No credential or PII exposure in the new function.

---

## 4. DATABASE SCHEMA CHANGES

| Table / Object | Change |
|----------------|--------|
| `newsletter_subscribers` | Added column `consent_status` text NOT NULL DEFAULT 'granted'. |
| `event_registrations` | Added column `user_id` UUID NULL REFERENCES auth.users(id) ON DELETE SET NULL if not present. |
| `get_event_registration_counts(event_ids uuid[])` | New function; returns `(event_id, registration_count)`; SECURITY DEFINER; execute granted to anon, authenticated. |

---

## 5. SUPABASE POLICY CHANGES

- No policy names or logic changed.  
- New migration only adds columns and the count function; existing RLS policies remain in place (e.g. newsletter: public insert, admin select; event_registrations: public insert, user select own, admin select).

---

## 6. DEPENDENCY UPGRADES AND HEALTH

- **Not changed:** No blind version bumps; existing `package.json` left as-is for stability.  
- **Noted:** `npm install` may warn about deprecated `glob@10.5.0` (from a transitive dependency). Recommended: run `npm audit` and `npm update` (or update the parent package that pins glob) when convenient.  
- **Recommendation:** Run `npm audit fix` (or manual fixes for breaking changes) and re-run tests and build.

---

## 7. NEW FEATURES IMPLEMENTED

- **Newsletter consent:** Explicit consent checkbox and stored `consent_status`; admin sees consent in table and in “Consent: Granted” stat.  
- **Policy acceptance on signup:** Terms and privacy acceptance written to `policy_acceptances` at registration when user id is available.  
- **Event attendee counts:** Public can see “X people registered” per event via `get_event_registration_counts`; no PII exposed.  
- **Guest event registration:** Clarified copy and behavior; optional `user_id` for members so guests remain supported.  
- **Strict DB types:** `src/types/database.ts` added for NewsletterSubscriber, PolicyAcceptance, EventRegistrationRow, ContactSubmission (for use in services and admin).

---

## 8. REMAINING RISKS AND RECOMMENDATIONS

1. **Secrets in .env:** Ensure production uses env vars only (no `.env` committed). Rotate anon key if it was ever committed.  
2. **Rate limiting:** Current implementation is in-memory per tab; for production consider server-side or Supabase Edge/rate-limit middleware.  
3. **HTTPS:** Enforce HTTPS at host (Vercel/hosting); no code change required.  
4. **Dependencies:** Address `glob` deprecation and run `npm audit`; upgrade cautiously.  
5. **TypeScript:** Consider enabling `strictNullChecks` and `noImplicitAny` gradually for safer typing.  
6. **Payments:** If donations/payments are added, use a certified provider (e.g. Stripe); do not build custom payment processing.

---

## 9. FILES MODIFIED

| File | Changes |
|------|--------|
| `docs/ARCHITECTURE_SUMMARY.md` | **Created** – architecture summary. |
| `supabase/migrations/20260306000001_newsletter_consent_and_event_user_id.sql` | **Created** – newsletter consent_status, event_registrations user_id, get_event_registration_counts. |
| `src/integrations/supabase/client.ts` | Env-based URL/key; fallback for VITE_SUPABASE_PUBLISHABLE_KEY. |
| `src/integrations/supabase/types.ts` | newsletter_subscribers.consent_status in Row/Insert/Update. |
| `src/contexts/AuthContext.tsx` | signUp return type and return value include `user`. |
| `src/pages/Register.tsx` | Call recordPolicyAcceptance(result.user.id) on signup success. |
| `src/components/NewsletterSignup.tsx` | Consent checkbox; consent_status in insert; rate limit; SecurityService.sanitizeEmail. |
| `src/pages/AdminDashboard.tsx` | Newsletter columns + consent_status; newsletter stats panel (total, recent, consent granted). |
| `src/utils/eventUtils.ts` | getEventRegistrationCounts(); registerForEvent passes user_id when logged in. |
| `src/pages/Events.tsx` | attendeeCounts state and fetch; “X people registered”; skeleton loading; guest copy; rate limit. |
| `src/components/ContactSection.tsx` | Rate limit; SecurityService for name, email, message. |
| `.gitignore` | .env, .env.*, !.env.example. |
| `.env.example` | **Created** – placeholders for Supabase env. |
| `src/types/database.ts` | **Created** – strict types for newsletter, policy, event registration, contact. |
| `src/App.tsx` | Lazy load MemberArea and AdminDashboard; Suspense + PageLoader. |
| `IMMANUEL_WORSHIP_CONNECT_SECURITY_AND_SYSTEM_IMPROVEMENT_REPORT.md` | **Created** – this report. |

---

## 10. COMMITS RECOMMENDED

Suggested commit messages (you can squash or split as needed):

1. `fix: newsletter consent and admin display (schema, form, dashboard)`  
2. `fix: record terms/privacy acceptance on signup`  
3. `feat: guest event registration and attendee counts`  
4. `security: env-based Supabase client, .gitignore, rate limits, sanitization`  
5. `ui: admin newsletter stats, events skeleton and counts, lazy admin/member routes`  
6. `chore: add database types and architecture doc`

---

**Report generated after Phases 1–8.** For deployment, run the new migration against your Supabase project and ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (or `VITE_SUPABASE_PUBLISHABLE_KEY`) are set in the build environment.
