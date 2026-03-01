
-- Fix RLS policies: Convert RESTRICTIVE to PERMISSIVE for all affected tables

-- ===== contact_submissions =====
DROP POLICY IF EXISTS "Admins can view contacts" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_submissions;

CREATE POLICY "Admins can view contacts"
  ON public.contact_submissions FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can submit contact"
  ON public.contact_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- ===== posts =====
DROP POLICY IF EXISTS "Admins can manage posts" ON public.posts;
DROP POLICY IF EXISTS "Published posts are public" ON public.posts;

CREATE POLICY "Admins can manage posts"
  ON public.posts FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Published posts are public"
  ON public.posts FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- ===== media_photos =====
DROP POLICY IF EXISTS "Admins can manage photos" ON public.media_photos;
DROP POLICY IF EXISTS "Photos are public" ON public.media_photos;

CREATE POLICY "Admins can manage photos"
  ON public.media_photos FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Photos are public"
  ON public.media_photos FOR SELECT
  TO anon, authenticated
  USING (true);

-- ===== media_videos =====
DROP POLICY IF EXISTS "Admins can manage videos" ON public.media_videos;
DROP POLICY IF EXISTS "Videos are public" ON public.media_videos;

CREATE POLICY "Admins can manage videos"
  ON public.media_videos FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Videos are public"
  ON public.media_videos FOR SELECT
  TO anon, authenticated
  USING (true);

-- ===== newsletter_subscribers =====
DROP POLICY IF EXISTS "Admins can view subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;

CREATE POLICY "Admins can view subscribers"
  ON public.newsletter_subscribers FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can subscribe"
  ON public.newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- ===== event_registrations =====
DROP POLICY IF EXISTS "Admins can view registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Anyone can register" ON public.event_registrations;

CREATE POLICY "Admins can view registrations"
  ON public.event_registrations FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can register"
  ON public.event_registrations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
