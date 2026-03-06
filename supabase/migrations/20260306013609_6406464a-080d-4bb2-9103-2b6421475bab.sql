
-- =====================================================
-- FIX: Recreate ALL RLS policies as PERMISSIVE
-- Root cause: All policies were RESTRICTIVE, meaning
-- ALL policies must pass (AND logic). This prevents
-- admins from accessing other users' data.
-- PERMISSIVE = OR logic (at least one must pass).
-- Also adds missing admin DELETE policies.
-- =====================================================

-- ========== appreciations ==========
DROP POLICY IF EXISTS "user_select_own_appreciations" ON public.appreciations;
DROP POLICY IF EXISTS "user_insert_appreciations" ON public.appreciations;
DROP POLICY IF EXISTS "user_update_own_appreciations" ON public.appreciations;

CREATE POLICY "user_select_own_appreciations" ON public.appreciations FOR SELECT TO authenticated USING ((auth.uid() = recipient_id) OR (auth.uid() = sender_id));
CREATE POLICY "admin_select_all_appreciations" ON public.appreciations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "user_insert_appreciations" ON public.appreciations FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "user_update_own_appreciations" ON public.appreciations FOR UPDATE TO authenticated USING (auth.uid() = recipient_id);
CREATE POLICY "admin_delete_appreciations" ON public.appreciations FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ========== audit_logs ==========
DROP POLICY IF EXISTS "authenticated_insert_audit" ON public.audit_logs;
DROP POLICY IF EXISTS "admin_select_audit" ON public.audit_logs;

CREATE POLICY "authenticated_insert_audit" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "admin_select_audit" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_delete_audit" ON public.audit_logs FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ========== contact_submissions ==========
DROP POLICY IF EXISTS "public_insert_contact" ON public.contact_submissions;
DROP POLICY IF EXISTS "admin_select_contact" ON public.contact_submissions;

CREATE POLICY "public_insert_contact" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_select_contact" ON public.contact_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_delete_contact" ON public.contact_submissions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ========== donations ==========
DROP POLICY IF EXISTS "user_select_own_donations" ON public.donations;
DROP POLICY IF EXISTS "user_insert_own_donations" ON public.donations;
DROP POLICY IF EXISTS "admin_select_all_donations" ON public.donations;

CREATE POLICY "user_select_own_donations" ON public.donations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_insert_own_donations" ON public.donations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admin_select_all_donations" ON public.donations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_delete_donations" ON public.donations FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ========== event_registrations ==========
DROP POLICY IF EXISTS "admin_select_registration" ON public.event_registrations;
DROP POLICY IF EXISTS "public_insert_registration" ON public.event_registrations;
DROP POLICY IF EXISTS "user_select_own_registration" ON public.event_registrations;
DROP POLICY IF EXISTS "user_update_own_registration" ON public.event_registrations;
DROP POLICY IF EXISTS "user_delete_own_registration" ON public.event_registrations;

CREATE POLICY "public_insert_registration" ON public.event_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "user_select_own_registration" ON public.event_registrations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admin_select_registration" ON public.event_registrations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "user_update_own_registration" ON public.event_registrations FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_delete_own_registration" ON public.event_registrations FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admin_delete_registration" ON public.event_registrations FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ========== events ==========
DROP POLICY IF EXISTS "public_select_events" ON public.events;
DROP POLICY IF EXISTS "admin_all_events" ON public.events;

CREATE POLICY "public_select_events" ON public.events FOR SELECT USING (true);
CREATE POLICY "admin_insert_events" ON public.events FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_update_events" ON public.events FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_delete_events" ON public.events FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ========== media_photos ==========
DROP POLICY IF EXISTS "public_select_photos" ON public.media_photos;
DROP POLICY IF EXISTS "admin_all_photos" ON public.media_photos;

CREATE POLICY "public_select_photos" ON public.media_photos FOR SELECT USING (true);
CREATE POLICY "admin_insert_photos" ON public.media_photos FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_update_photos" ON public.media_photos FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_delete_photos" ON public.media_photos FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ========== media_videos ==========
DROP POLICY IF EXISTS "public_select_videos" ON public.media_videos;
DROP POLICY IF EXISTS "admin_all_videos" ON public.media_videos;

CREATE POLICY "public_select_videos" ON public.media_videos FOR SELECT USING (true);
CREATE POLICY "admin_insert_videos" ON public.media_videos FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_update_videos" ON public.media_videos FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_delete_videos" ON public.media_videos FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ========== newsletter_subscribers ==========
DROP POLICY IF EXISTS "public_insert_subscriber" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "admin_select_subscriber" ON public.newsletter_subscribers;

CREATE POLICY "public_insert_subscriber" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_select_subscriber" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_delete_subscriber" ON public.newsletter_subscribers FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ========== policy_acceptances ==========
DROP POLICY IF EXISTS "user_insert_acceptance" ON public.policy_acceptances;
DROP POLICY IF EXISTS "user_select_acceptance" ON public.policy_acceptances;
DROP POLICY IF EXISTS "admin_select_all_acceptances" ON public.policy_acceptances;

CREATE POLICY "user_insert_acceptance" ON public.policy_acceptances FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_select_acceptance" ON public.policy_acceptances FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admin_select_all_acceptances" ON public.policy_acceptances FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_delete_acceptances" ON public.policy_acceptances FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ========== posts ==========
DROP POLICY IF EXISTS "public_select_published_posts" ON public.posts;
DROP POLICY IF EXISTS "admin_all_posts" ON public.posts;

CREATE POLICY "public_select_published_posts" ON public.posts FOR SELECT USING (published = true);
CREATE POLICY "admin_select_all_posts" ON public.posts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_insert_posts" ON public.posts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_update_posts" ON public.posts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_delete_posts" ON public.posts FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ========== profiles ==========
DROP POLICY IF EXISTS "user_select_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "user_update_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "user_insert_own_profile" ON public.profiles;
DROP POLICY IF EXISTS "admin_select_all_profiles" ON public.profiles;

CREATE POLICY "user_select_own_profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_update_own_profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_insert_own_profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admin_select_all_profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_delete_profiles" ON public.profiles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ========== sermons ==========
DROP POLICY IF EXISTS "public_select_published_sermons" ON public.sermons;
DROP POLICY IF EXISTS "admin_all_sermons" ON public.sermons;

CREATE POLICY "public_select_published_sermons" ON public.sermons FOR SELECT USING (published = true);
CREATE POLICY "admin_select_all_sermons" ON public.sermons FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_insert_sermons" ON public.sermons FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_update_sermons" ON public.sermons FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_delete_sermons" ON public.sermons FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ========== user_roles ==========
DROP POLICY IF EXISTS "user_select_own_roles" ON public.user_roles;
DROP POLICY IF EXISTS "admin_all_roles" ON public.user_roles;

CREATE POLICY "user_select_own_roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admin_select_all_roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_insert_roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_update_roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin_delete_roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
