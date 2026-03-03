
-- Drop ALL existing policies on contact_submissions and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view contacts" ON public.contact_submissions;

CREATE POLICY "Anyone can submit contact"
ON public.contact_submissions AS PERMISSIVE
FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins can view contacts"
ON public.contact_submissions AS PERMISSIVE
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Fix event_registrations
DROP POLICY IF EXISTS "Anyone can register" ON public.event_registrations;
DROP POLICY IF EXISTS "Admins can view registrations" ON public.event_registrations;

CREATE POLICY "Anyone can register"
ON public.event_registrations AS PERMISSIVE
FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins can view registrations"
ON public.event_registrations AS PERMISSIVE
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Fix newsletter_subscribers
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can view subscribers" ON public.newsletter_subscribers;

CREATE POLICY "Anyone can subscribe"
ON public.newsletter_subscribers AS PERMISSIVE
FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins can view subscribers"
ON public.newsletter_subscribers AS PERMISSIVE
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Fix policy_acceptances
DROP POLICY IF EXISTS "Users can insert own acceptance" ON public.policy_acceptances;
DROP POLICY IF EXISTS "Users can view own acceptance" ON public.policy_acceptances;
DROP POLICY IF EXISTS "Admins can view all acceptances" ON public.policy_acceptances;

CREATE POLICY "Users can insert own acceptance"
ON public.policy_acceptances AS PERMISSIVE
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own acceptance"
ON public.policy_acceptances AS PERMISSIVE
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all acceptances"
ON public.policy_acceptances AS PERMISSIVE
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Fix posts
DROP POLICY IF EXISTS "Admins can manage posts" ON public.posts;
DROP POLICY IF EXISTS "Published posts are public" ON public.posts;

CREATE POLICY "Admins can manage posts"
ON public.posts AS PERMISSIVE
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Published posts are public"
ON public.posts AS PERMISSIVE
FOR SELECT TO public USING (published = true);

-- Fix media_photos
DROP POLICY IF EXISTS "Admins can manage photos" ON public.media_photos;
DROP POLICY IF EXISTS "Photos are public" ON public.media_photos;

CREATE POLICY "Admins can manage photos"
ON public.media_photos AS PERMISSIVE
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Photos are public"
ON public.media_photos AS PERMISSIVE
FOR SELECT TO public USING (true);

-- Fix media_videos
DROP POLICY IF EXISTS "Admins can manage videos" ON public.media_videos;
DROP POLICY IF EXISTS "Videos are public" ON public.media_videos;

CREATE POLICY "Admins can manage videos"
ON public.media_videos AS PERMISSIVE
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Videos are public"
ON public.media_videos AS PERMISSIVE
FOR SELECT TO public USING (true);

-- Fix sermons
DROP POLICY IF EXISTS "Admins can manage sermons" ON public.sermons;
DROP POLICY IF EXISTS "Published sermons are public" ON public.sermons;

CREATE POLICY "Admins can manage sermons"
ON public.sermons AS PERMISSIVE
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Published sermons are public"
ON public.sermons AS PERMISSIVE
FOR SELECT TO public USING (published = true);

-- Fix events
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
DROP POLICY IF EXISTS "Events are publicly readable" ON public.events;

CREATE POLICY "Admins can manage events"
ON public.events AS PERMISSIVE
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Events are publicly readable"
ON public.events AS PERMISSIVE
FOR SELECT TO public USING (true);

-- Fix audit_logs
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Authenticated can insert audit logs" ON public.audit_logs;

CREATE POLICY "Admins can view audit logs"
ON public.audit_logs AS PERMISSIVE
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can insert audit logs"
ON public.audit_logs AS PERMISSIVE
FOR INSERT TO authenticated WITH CHECK (true);
