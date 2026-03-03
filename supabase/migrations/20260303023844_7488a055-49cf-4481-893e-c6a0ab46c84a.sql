
-- Fix contact_submissions: change to PERMISSIVE
DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact" ON public.contact_submissions
FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view contacts" ON public.contact_submissions;
CREATE POLICY "Admins can view contacts" ON public.contact_submissions
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Fix event_registrations: change to PERMISSIVE
DROP POLICY IF EXISTS "Anyone can register" ON public.event_registrations;
CREATE POLICY "Anyone can register" ON public.event_registrations
FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view registrations" ON public.event_registrations;
CREATE POLICY "Admins can view registrations" ON public.event_registrations
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Fix newsletter_subscribers: change to PERMISSIVE
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can view subscribers" ON public.newsletter_subscribers
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Fix policy_acceptances: change to PERMISSIVE
DROP POLICY IF EXISTS "Users can insert own acceptance" ON public.policy_acceptances;
CREATE POLICY "Users can insert own acceptance" ON public.policy_acceptances
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own acceptance" ON public.policy_acceptances;
CREATE POLICY "Users can view own acceptance" ON public.policy_acceptances
FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all acceptances" ON public.policy_acceptances;
CREATE POLICY "Admins can view all acceptances" ON public.policy_acceptances
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Fix posts: change to PERMISSIVE
DROP POLICY IF EXISTS "Admins can manage posts" ON public.posts;
CREATE POLICY "Admins can manage posts" ON public.posts
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Published posts are public" ON public.posts;
CREATE POLICY "Published posts are public" ON public.posts
FOR SELECT TO public USING (published = true);

-- Fix media_photos: change to PERMISSIVE
DROP POLICY IF EXISTS "Admins can manage photos" ON public.media_photos;
CREATE POLICY "Admins can manage photos" ON public.media_photos
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Photos are public" ON public.media_photos;
CREATE POLICY "Photos are public" ON public.media_photos
FOR SELECT TO public USING (true);

-- Fix media_videos: change to PERMISSIVE
DROP POLICY IF EXISTS "Admins can manage videos" ON public.media_videos;
CREATE POLICY "Admins can manage videos" ON public.media_videos
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Videos are public" ON public.media_videos;
CREATE POLICY "Videos are public" ON public.media_videos
FOR SELECT TO public USING (true);

-- Fix sermons: change to PERMISSIVE
DROP POLICY IF EXISTS "Admins can manage sermons" ON public.sermons;
CREATE POLICY "Admins can manage sermons" ON public.sermons
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Published sermons are public" ON public.sermons;
CREATE POLICY "Published sermons are public" ON public.sermons
FOR SELECT TO public USING (published = true);

-- Fix events: change to PERMISSIVE
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
CREATE POLICY "Admins can manage events" ON public.events
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Events are publicly readable" ON public.events;
CREATE POLICY "Events are publicly readable" ON public.events
FOR SELECT TO public USING (true);
