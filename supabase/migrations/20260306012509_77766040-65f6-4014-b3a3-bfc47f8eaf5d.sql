
-- 1. Add consent_status to newsletter_subscribers
ALTER TABLE public.newsletter_subscribers ADD COLUMN IF NOT EXISTS consent_status text DEFAULT 'granted';

-- 2. Create get_event_registration_counts function for public use
CREATE OR REPLACE FUNCTION public.get_event_registration_counts(event_ids uuid[])
RETURNS TABLE(event_id uuid, registration_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT er.event_id, count(*)::bigint as registration_count
  FROM public.event_registrations er
  WHERE er.event_id = ANY(event_ids)
  GROUP BY er.event_id;
$$;

-- 3. Drop ALL existing RLS policies and recreate as PERMISSIVE

-- appreciations
DROP POLICY IF EXISTS "user_select_own_appreciations" ON public.appreciations;
DROP POLICY IF EXISTS "user_insert_appreciations" ON public.appreciations;
DROP POLICY IF EXISTS "user_update_own_appreciations" ON public.appreciations;

CREATE POLICY "user_select_own_appreciations" ON public.appreciations FOR SELECT TO authenticated USING ((auth.uid() = recipient_id) OR (auth.uid() = sender_id));
CREATE POLICY "user_insert_appreciations" ON public.appreciations FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "user_update_own_appreciations" ON public.appreciations FOR UPDATE TO authenticated USING (auth.uid() = recipient_id);

-- audit_logs
DROP POLICY IF EXISTS "authenticated_insert_audit" ON public.audit_logs;
DROP POLICY IF EXISTS "admin_select_audit" ON public.audit_logs;

CREATE POLICY "authenticated_insert_audit" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "admin_select_audit" ON public.audit_logs FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- contact_submissions
DROP POLICY IF EXISTS "public_insert_contact" ON public.contact_submissions;
DROP POLICY IF EXISTS "admin_select_contact" ON public.contact_submissions;

CREATE POLICY "public_insert_contact" ON public.contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin_select_contact" ON public.contact_submissions FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- donations
DROP POLICY IF EXISTS "user_select_own_donations" ON public.donations;
DROP POLICY IF EXISTS "user_insert_own_donations" ON public.donations;
DROP POLICY IF EXISTS "admin_select_all_donations" ON public.donations;

CREATE POLICY "user_select_own_donations" ON public.donations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_insert_own_donations" ON public.donations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admin_select_all_donations" ON public.donations FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- event_registrations
DROP POLICY IF EXISTS "public_insert_registration" ON public.event_registrations;
DROP POLICY IF EXISTS "user_select_own_registration" ON public.event_registrations;
DROP POLICY IF EXISTS "user_update_own_registration" ON public.event_registrations;
DROP POLICY IF EXISTS "user_delete_own_registration" ON public.event_registrations;
DROP POLICY IF EXISTS "admin_select_registration" ON public.event_registrations;

CREATE POLICY "public_insert_registration" ON public.event_registrations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "user_select_own_registration" ON public.event_registrations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_update_own_registration" ON public.event_registrations FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_delete_own_registration" ON public.event_registrations FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admin_select_registration" ON public.event_registrations FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- events
DROP POLICY IF EXISTS "public_select_events" ON public.events;
DROP POLICY IF EXISTS "admin_all_events" ON public.events;

CREATE POLICY "public_select_events" ON public.events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin_all_events" ON public.events FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- media_photos
DROP POLICY IF EXISTS "public_select_photos" ON public.media_photos;
DROP POLICY IF EXISTS "admin_all_photos" ON public.media_photos;

CREATE POLICY "public_select_photos" ON public.media_photos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin_all_photos" ON public.media_photos FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- media_videos
DROP POLICY IF EXISTS "public_select_videos" ON public.media_videos;
DROP POLICY IF EXISTS "admin_all_videos" ON public.media_videos;

CREATE POLICY "public_select_videos" ON public.media_videos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin_all_videos" ON public.media_videos FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- newsletter_subscribers
DROP POLICY IF EXISTS "public_insert_subscriber" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "admin_select_subscriber" ON public.newsletter_subscribers;

CREATE POLICY "public_insert_subscriber" ON public.newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin_select_subscriber" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- policy_acceptances
DROP POLICY IF EXISTS "user_insert_acceptance" ON public.policy_acceptances;
DROP POLICY IF EXISTS "user_select_acceptance" ON public.policy_acceptances;
DROP POLICY IF EXISTS "admin_select_all_acceptances" ON public.policy_acceptances;

CREATE POLICY "user_insert_acceptance" ON public.policy_acceptances FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_select_acceptance" ON public.policy_acceptances FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admin_select_all_acceptances" ON public.policy_acceptances FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- posts
DROP POLICY IF EXISTS "public_select_published_posts" ON public.posts;
DROP POLICY IF EXISTS "admin_all_posts" ON public.posts;

CREATE POLICY "public_select_published_posts" ON public.posts FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "admin_all_posts" ON public.posts FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- profiles
DROP POLICY IF EXISTS "user_select_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "user_update_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "user_insert_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "admin_select_all_profiles" ON public.profiles;

CREATE POLICY "user_select_own_profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_update_own_profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_insert_own_profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admin_select_all_profiles" ON public.profiles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- sermons
DROP POLICY IF EXISTS "public_select_published_sermons" ON public.sermons;
DROP POLICY IF EXISTS "admin_all_sermons" ON public.sermons;

CREATE POLICY "public_select_published_sermons" ON public.sermons FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "admin_all_sermons" ON public.sermons FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- user_roles
DROP POLICY IF EXISTS "user_select_own_roles" ON public.user_roles;
DROP POLICY IF EXISTS "admin_all_roles" ON public.user_roles;

CREATE POLICY "user_select_own_roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admin_all_roles" ON public.user_roles FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 4. Add unique constraint on event_registrations to prevent duplicates at DB level
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_event_email_registration') THEN
    ALTER TABLE public.event_registrations ADD CONSTRAINT unique_event_email_registration UNIQUE (event_id, email);
  END IF;
END $$;

-- 5. Add unique constraint on newsletter_subscribers email
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_newsletter_email') THEN
    ALTER TABLE public.newsletter_subscribers ADD CONSTRAINT unique_newsletter_email UNIQUE (email);
  END IF;
END $$;
