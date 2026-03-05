
-- ============================================================
-- Recreate ALL RLS policies as PERMISSIVE (default)
-- The previous policies were all RESTRICTIVE which blocks access
-- ============================================================

-- APPRECIATIONS
DROP POLICY IF EXISTS "user_select_own_appreciations" ON public.appreciations;
DROP POLICY IF EXISTS "user_insert_appreciations" ON public.appreciations;
DROP POLICY IF EXISTS "user_update_own_appreciations" ON public.appreciations;

CREATE POLICY "user_select_own_appreciations" ON public.appreciations FOR SELECT USING ((auth.uid() = recipient_id) OR (auth.uid() = sender_id));
CREATE POLICY "user_insert_appreciations" ON public.appreciations FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "user_update_own_appreciations" ON public.appreciations FOR UPDATE USING (auth.uid() = recipient_id);

-- AUDIT_LOGS
DROP POLICY IF EXISTS "authenticated_insert_audit" ON public.audit_logs;
DROP POLICY IF EXISTS "admin_select_audit" ON public.audit_logs;

CREATE POLICY "authenticated_insert_audit" ON public.audit_logs FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "admin_select_audit" ON public.audit_logs FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- CONTACT_SUBMISSIONS
DROP POLICY IF EXISTS "public_insert_contact" ON public.contact_submissions;
DROP POLICY IF EXISTS "admin_select_contact" ON public.contact_submissions;

CREATE POLICY "public_insert_contact" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_select_contact" ON public.contact_submissions FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- DONATIONS
DROP POLICY IF EXISTS "user_select_own_donations" ON public.donations;
DROP POLICY IF EXISTS "user_insert_own_donations" ON public.donations;
DROP POLICY IF EXISTS "admin_select_all_donations" ON public.donations;

CREATE POLICY "user_select_own_donations" ON public.donations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_insert_own_donations" ON public.donations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admin_select_all_donations" ON public.donations FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- EVENT_REGISTRATIONS
DROP POLICY IF EXISTS "User insert registration" ON public.event_registrations;
DROP POLICY IF EXISTS "User update registration" ON public.event_registrations;
DROP POLICY IF EXISTS "User delete registration" ON public.event_registrations;
DROP POLICY IF EXISTS "public_insert_registration" ON public.event_registrations;
DROP POLICY IF EXISTS "admin_select_registration" ON public.event_registrations;

CREATE POLICY "public_insert_registration" ON public.event_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "user_select_own_registration" ON public.event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_update_own_registration" ON public.event_registrations FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_delete_own_registration" ON public.event_registrations FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "admin_select_registration" ON public.event_registrations FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- EVENTS
DROP POLICY IF EXISTS "public_select_events" ON public.events;
DROP POLICY IF EXISTS "admin_all_events" ON public.events;

CREATE POLICY "public_select_events" ON public.events FOR SELECT USING (true);
CREATE POLICY "admin_all_events" ON public.events FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- MEDIA_PHOTOS
DROP POLICY IF EXISTS "public_select_photos" ON public.media_photos;
DROP POLICY IF EXISTS "admin_all_photos" ON public.media_photos;

CREATE POLICY "public_select_photos" ON public.media_photos FOR SELECT USING (true);
CREATE POLICY "admin_all_photos" ON public.media_photos FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- MEDIA_VIDEOS
DROP POLICY IF EXISTS "public_select_videos" ON public.media_videos;
DROP POLICY IF EXISTS "admin_all_videos" ON public.media_videos;

CREATE POLICY "public_select_videos" ON public.media_videos FOR SELECT USING (true);
CREATE POLICY "admin_all_videos" ON public.media_videos FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- NEWSLETTER_SUBSCRIBERS
DROP POLICY IF EXISTS "public_insert_subscriber" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "admin_select_subscriber" ON public.newsletter_subscribers;

CREATE POLICY "public_insert_subscriber" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_select_subscriber" ON public.newsletter_subscribers FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- POLICY_ACCEPTANCES
DROP POLICY IF EXISTS "user_insert_acceptance" ON public.policy_acceptances;
DROP POLICY IF EXISTS "user_select_acceptance" ON public.policy_acceptances;
DROP POLICY IF EXISTS "admin_select_all_acceptances" ON public.policy_acceptances;

CREATE POLICY "user_insert_acceptance" ON public.policy_acceptances FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_select_acceptance" ON public.policy_acceptances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "admin_select_all_acceptances" ON public.policy_acceptances FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- POSTS
DROP POLICY IF EXISTS "public_select_published_posts" ON public.posts;
DROP POLICY IF EXISTS "admin_all_posts" ON public.posts;

CREATE POLICY "public_select_published_posts" ON public.posts FOR SELECT USING (published = true);
CREATE POLICY "admin_all_posts" ON public.posts FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- PROFILES
DROP POLICY IF EXISTS "user_select_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "user_update_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "user_insert_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "admin_select_all_profiles" ON public.profiles;

CREATE POLICY "user_select_own_profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_update_own_profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_insert_own_profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admin_select_all_profiles" ON public.profiles FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- SERMONS
DROP POLICY IF EXISTS "public_select_published_sermons" ON public.sermons;
DROP POLICY IF EXISTS "admin_all_sermons" ON public.sermons;

CREATE POLICY "public_select_published_sermons" ON public.sermons FOR SELECT USING (published = true);
CREATE POLICY "admin_all_sermons" ON public.sermons FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- USER_ROLES
DROP POLICY IF EXISTS "user_select_own_roles" ON public.user_roles;
DROP POLICY IF EXISTS "admin_all_roles" ON public.user_roles;

CREATE POLICY "user_select_own_roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "admin_all_roles" ON public.user_roles FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
