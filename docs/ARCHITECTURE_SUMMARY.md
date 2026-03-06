# Immanuel Worship Connect — Architecture Summary

## Tech Stack
- **React**: 18.3.1
- **TypeScript**: 5.5.3 (strictNullChecks: false, noImplicitAny: false)
- **Build**: Vite 7.3.1 with @vitejs/plugin-react-swc
- **Routing**: react-router-dom 6.26
- **State**: @tanstack/react-query, React context (AuthContext)
- **UI**: Radix UI, Tailwind CSS, shadcn-style components
- **Backend**: Supabase (Auth, Postgres, RLS, Storage)

## Supabase Client
- **Location**: `src/integrations/supabase/client.ts`
- **Issue**: URL and anon key are hardcoded (must use env vars).
- **Options**: persistSession: true, autoRefreshToken: true, storage: localStorage.

## Authentication Flow
- **Provider**: `AuthContext` in `src/contexts/AuthContext.tsx` wraps the app.
- **Roles**: Fetched from `user_roles` by `user_id`; `hasRole('admin')` and `isAdmin` derived.
- **Methods**: signIn, signUp, signOut, refreshSession, requestPasswordReset, updatePassword.
- **Session**: Supabase `onAuthStateChange` and `getSession()`; roles loaded after session.

## Session Management
- Stored in localStorage via Supabase client.
- Token refresh and expiration handled by Supabase SDK.
- `SecurityService.validateSessionToken()` used in AuthGuard/ProtectedRoute (JWT structure check).

## Environment Variables
- **Current**: Not used in client (credentials hardcoded).
- **Required**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` for client.

## Routing Structure
- **Public**: /, /about, /services, /events, /media, /blog, /sermons, /donate, /terms, /privacy, /contact, /login, /register, /reset-password, /update-password.
- **Protected**: /member (AuthGuard), /admin (AuthGuard adminOnly).
- **Fallback**: * → NotFound.

## Protected Route Logic
- **AuthGuard**: Checks user, loading, email confirmation, adminOnly, requiredRole; redirects to /login or /member.
- **ProtectedRoute**: Same checks used on admin dashboard content.
- Admin check: `hasRole('admin')` from `user_roles`.

## Admin Dashboard
- **Page**: `AdminDashboard.tsx` with tabs: Analytics, Members, Events, Content (Blog/Sermon/Media), Donations, Communications (Contact, Newsletter, Policy Acceptances), Admin Mgmt.
- **Data**: Fetched via `adminService` (getUserProfiles, getContactSubmissions, getNewsletterSubscribers, getEventRegistrations, plus policy_acceptances via supabase directly).
- **Tables**: EnhancedDataTable with search, sort, export, bulk delete.

## Form Handling
- Mix of controlled state and react-hook-form (e.g. with zod).
- Validation: SecurityService (email, password, sanitization), custom validateForm in Register.

## API Interaction
- Supabase client used directly in components and in services (admin.service, base.service).
- No separate REST API layer; all DB access via Supabase client with RLS.

## Supabase Storage
- Bucket `media` for uploads; policies for admin insert/update/delete, public read.

## Newsletter System
- **Form**: `NewsletterSignup.tsx` inserts into `newsletter_subscribers` (email, subscribed_at). No consent field.
- **Table**: id, email, subscribed_at (no consent_status).
- **Admin**: getNewsletterSubscribers() selects *; displayed in Communications tab. If RLS or schema mismatch, data may not show or consent is missing.

## Event Registration
- **Flow**: Events page lists events; modal collects name, email, phone; `registerForEvent()` in eventUtils inserts into `event_registrations` (event_id, name, email, phone). user_id not sent (guests).
- **Table**: event_registrations has event_id, name, email, phone, registered_at; types include optional user_id (migration may have added it).
- **Duplicate check**: Same event_id + email checked before insert.
- **Admin**: Event Registrations table in dashboard.

## Database Tables (from migrations and types)
- profiles, user_roles, contact_submissions, newsletter_subscribers, events, event_registrations, posts, sermons, donations, appreciations, audit_logs, media_photos, media_videos, policy_acceptances.
- RLS enabled on all; policies use has_role(auth.uid(), 'admin'::app_role) for admin access.
- has_role() is SECURITY DEFINER, reads from user_roles; app_role enum in initial migration.

## Identified Issues (pre-fix)
1. Hardcoded Supabase credentials in client.
2. .gitignore missing .env.
3. Newsletter: no consent_status; admin may not show data if RLS/role mismatch.
4. Terms/Privacy: recordPolicyAcceptance() never called on signup (no user id returned).
5. event_registrations: original schema has no user_id; types have user_id (guests need null).
