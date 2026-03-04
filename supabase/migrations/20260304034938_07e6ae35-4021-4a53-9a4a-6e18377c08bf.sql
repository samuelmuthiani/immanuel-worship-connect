
-- =====================================================
-- COMPREHENSIVE FIX: Convert ALL restrictive policies to permissive
-- =====================================================

-- 1. contact_submissions
DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view contacts" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit contact " ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view contacts " ON public.contact_submissions;

CREATE POLICY "public_insert_contact" ON public.contact_submissions
  AS PERMISSIVE FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "admin_select_contact" ON public.contact_submissions
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. event_registrations
DROP POLICY IF EXISTS "Anyone can register" ON public.event_registrations;
DROP POLICY IF EXISTS "Admins can view registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Anyone can register " ON public.event_registrations;
DROP POLICY IF EXISTS "Admins can view registrations " ON public.event_registrations;

CREATE POLICY "public_insert_registration" ON public.event_registrations
  AS PERMISSIVE FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "admin_select_registration" ON public.event_registrations
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. newsletter_subscribers
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can view subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can subscribe " ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can view subscribers " ON public.newsletter_subscribers;

CREATE POLICY "public_insert_subscriber" ON public.newsletter_subscribers
  AS PERMISSIVE FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "admin_select_subscriber" ON public.newsletter_subscribers
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. policy_acceptances
DROP POLICY IF EXISTS "Users can insert own acceptance" ON public.policy_acceptances;
DROP POLICY IF EXISTS "Users can view own acceptance" ON public.policy_acceptances;
DROP POLICY IF EXISTS "Admins can view all acceptances" ON public.policy_acceptances;
DROP POLICY IF EXISTS "Users can insert own acceptance " ON public.policy_acceptances;
DROP POLICY IF EXISTS "Users can view own acceptance " ON public.policy_acceptances;
DROP POLICY IF EXISTS "Admins can view all acceptances " ON public.policy_acceptances;

CREATE POLICY "user_insert_acceptance" ON public.policy_acceptances
  AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_select_acceptance" ON public.policy_acceptances
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "admin_select_all_acceptances" ON public.policy_acceptances
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. events (public read)
DROP POLICY IF EXISTS "Events are publicly readable" ON public.events;
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
DROP POLICY IF EXISTS "Events are publicly readable " ON public.events;
DROP POLICY IF EXISTS "Admins can manage events " ON public.events;

CREATE POLICY "public_select_events" ON public.events
  AS PERMISSIVE FOR SELECT TO public USING (true);

CREATE POLICY "admin_all_events" ON public.events
  AS PERMISSIVE FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 6. posts
DROP POLICY IF EXISTS "Published posts are public" ON public.posts;
DROP POLICY IF EXISTS "Admins can manage posts" ON public.posts;
DROP POLICY IF EXISTS "Published posts are public " ON public.posts;
DROP POLICY IF EXISTS "Admins can manage posts " ON public.posts;

CREATE POLICY "public_select_published_posts" ON public.posts
  AS PERMISSIVE FOR SELECT TO public USING (published = true);

CREATE POLICY "admin_all_posts" ON public.posts
  AS PERMISSIVE FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 7. media_photos
DROP POLICY IF EXISTS "Photos are public" ON public.media_photos;
DROP POLICY IF EXISTS "Admins can manage photos" ON public.media_photos;
DROP POLICY IF EXISTS "Photos are public " ON public.media_photos;
DROP POLICY IF EXISTS "Admins can manage photos " ON public.media_photos;

CREATE POLICY "public_select_photos" ON public.media_photos
  AS PERMISSIVE FOR SELECT TO public USING (true);

CREATE POLICY "admin_all_photos" ON public.media_photos
  AS PERMISSIVE FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 8. media_videos
DROP POLICY IF EXISTS "Videos are public" ON public.media_videos;
DROP POLICY IF EXISTS "Admins can manage videos" ON public.media_videos;
DROP POLICY IF EXISTS "Videos are public " ON public.media_videos;
DROP POLICY IF EXISTS "Admins can manage videos " ON public.media_videos;

CREATE POLICY "public_select_videos" ON public.media_videos
  AS PERMISSIVE FOR SELECT TO public USING (true);

CREATE POLICY "admin_all_videos" ON public.media_videos
  AS PERMISSIVE FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 9. sermons
DROP POLICY IF EXISTS "Published sermons are public" ON public.sermons;
DROP POLICY IF EXISTS "Admins can manage sermons" ON public.sermons;
DROP POLICY IF EXISTS "Published sermons are public " ON public.sermons;
DROP POLICY IF EXISTS "Admins can manage sermons " ON public.sermons;

CREATE POLICY "public_select_published_sermons" ON public.sermons
  AS PERMISSIVE FOR SELECT TO public USING (published = true);

CREATE POLICY "admin_all_sermons" ON public.sermons
  AS PERMISSIVE FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 10. audit_logs
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Authenticated can insert audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admins can view audit logs " ON public.audit_logs;
DROP POLICY IF EXISTS "Authenticated can insert audit logs " ON public.audit_logs;

CREATE POLICY "admin_select_audit" ON public.audit_logs
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "authenticated_insert_audit" ON public.audit_logs
  AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK (true);

-- 11. profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile " ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile " ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles " ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile " ON public.profiles;

CREATE POLICY "user_select_own_profile" ON public.profiles
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_update_own_profile" ON public.profiles
  AS PERMISSIVE FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_insert_own_profile" ON public.profiles
  AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admin_select_all_profiles" ON public.profiles
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 12. user_roles
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read own roles " ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles " ON public.user_roles;

CREATE POLICY "user_select_own_roles" ON public.user_roles
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "admin_all_roles" ON public.user_roles
  AS PERMISSIVE FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 13. donations
DROP POLICY IF EXISTS "Users can view own donations" ON public.donations;
DROP POLICY IF EXISTS "Users can insert own donations" ON public.donations;
DROP POLICY IF EXISTS "Admins can view all donations" ON public.donations;
DROP POLICY IF EXISTS "Users can view own donations " ON public.donations;
DROP POLICY IF EXISTS "Users can insert own donations " ON public.donations;
DROP POLICY IF EXISTS "Admins can view all donations " ON public.donations;

CREATE POLICY "user_select_own_donations" ON public.donations
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_insert_own_donations" ON public.donations
  AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admin_select_all_donations" ON public.donations
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 14. appreciations
DROP POLICY IF EXISTS "Users can view own appreciations" ON public.appreciations;
DROP POLICY IF EXISTS "Users can send appreciations" ON public.appreciations;
DROP POLICY IF EXISTS "Users can update own appreciations" ON public.appreciations;
DROP POLICY IF EXISTS "Users can view own appreciations " ON public.appreciations;
DROP POLICY IF EXISTS "Users can send appreciations " ON public.appreciations;
DROP POLICY IF EXISTS "Users can update own appreciations " ON public.appreciations;

CREATE POLICY "user_select_own_appreciations" ON public.appreciations
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (auth.uid() = recipient_id OR auth.uid() = sender_id);

CREATE POLICY "user_insert_appreciations" ON public.appreciations
  AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "user_update_own_appreciations" ON public.appreciations
  AS PERMISSIVE FOR UPDATE TO authenticated
  USING (auth.uid() = recipient_id);
