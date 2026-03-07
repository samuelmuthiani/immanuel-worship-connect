-- Advanced Management and Reporting Migration
-- Description: Consolidated stats, role management, and storage cleanup helpers

-- 1. Consolidated Admin Stats Function
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result JSONB;
BEGIN
    -- Check if user is admin
    IF NOT public.has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Administrative access required';
    END IF;

    SELECT jsonb_build_object(
        'total_members', (SELECT count(*) FROM public.profiles),
        'total_events', (SELECT count(*) FROM public.events),
        'total_submissions', (SELECT count(*) FROM public.contact_submissions),
        'total_subscribers', (SELECT count(*) FROM public.newsletter_subscribers),
        'total_registrations', (SELECT count(*) FROM public.event_registrations),
        'total_guests', (SELECT count(*) FROM public.event_registrations WHERE is_guest = true),
        'total_donations', (SELECT COALESCE(sum(amount), 0) FROM public.donations WHERE status = 'completed'),
        'total_page_views', (SELECT count(*) FROM public.page_views),
        'storage_usage', (
            SELECT jsonb_build_object(
                'photos', (SELECT count(*) FROM public.media_photos),
                'videos', (SELECT count(*) FROM public.media_videos)
            )
        )
    ) INTO result;

    RETURN result;
END;
$$;

-- 2. Helper function to check if a user is an admin more efficiently
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

-- 3. Function to get a user's role string
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text FROM public.user_roles WHERE user_id = _user_id LIMIT 1;
$$;

-- 4. Secure function for admins to update user roles
CREATE OR REPLACE FUNCTION public.set_user_role(_user_id UUID, _role app_role)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if current user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only admins can manage roles';
  END IF;

  -- Update or insert role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, _role)
  ON CONFLICT (user_id, role) DO UPDATE SET role = EXCLUDED.role;
  
  -- Log the action
  INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, details)
  VALUES (auth.uid(), 'UPDATE_ROLE', 'user_roles', _user_id::text, jsonb_build_object('new_role', _role::text));
END;
$$;

-- 5. Comprehensive User Account Deletion Function
CREATE OR REPLACE FUNCTION public.delete_user_account(_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is deleting themselves OR is an admin
  IF auth.uid() <> _user_id AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized to delete this account';
  END IF;

  -- Data is mostly cleaned up by ON DELETE CASCADE, but we handle specific logic here
  
  -- Log the deletion
  INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, details)
  VALUES (auth.uid(), 'DELETE_USER', 'profiles', _user_id::text, jsonb_build_object('deleted_at', now()));

  -- Delete from auth.users (requires service role / high privilege usually)
  -- Note: This might fail if the database user doesn't have permissions on auth schema.
  -- In Supabase, you usually delete the auth user via Admin API from edge function.
  -- We'll just delete the profile and let the cascade handle the rest of public data.
  DELETE FROM public.profiles WHERE user_id = _user_id;
  DELETE FROM public.user_roles WHERE user_id = _user_id;
END;
$$;

-- 6. Storage Deletion Tracker
-- We'll use a table to log file URLs that need to be deleted from storage
CREATE TABLE IF NOT EXISTS public.deleted_media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    bucket TEXT NOT NULL DEFAULT 'media',
    deleted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    processed BOOLEAN DEFAULT false
);

CREATE OR REPLACE FUNCTION public.log_media_asset_deletion()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.deleted_media_assets (url)
    VALUES (OLD.url);
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply to media tables
DROP TRIGGER IF EXISTS tr_log_photo_deletion ON public.media_photos;
CREATE TRIGGER tr_log_photo_deletion
AFTER DELETE ON public.media_photos
FOR EACH ROW EXECUTE FUNCTION public.log_media_asset_deletion();

DROP TRIGGER IF EXISTS tr_log_video_deletion ON public.media_videos;
CREATE TRIGGER tr_log_video_deletion
AFTER DELETE ON public.media_videos
FOR EACH ROW EXECUTE FUNCTION public.log_media_asset_deletion();

DROP TRIGGER IF EXISTS tr_log_post_image_deletion ON public.posts;
CREATE TRIGGER tr_log_post_image_deletion
AFTER DELETE ON public.posts
FOR EACH ROW WHEN (OLD.image_url IS NOT NULL)
EXECUTE FUNCTION public.log_media_asset_deletion();

-- 7. Statistics View Helper
CREATE OR REPLACE FUNCTION public.get_registrations_per_event()
RETURNS TABLE (event_id UUID, event_title TEXT, registration_count BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    e.id, 
    e.title, 
    count(r.id) as registration_count
  FROM public.events e
  LEFT JOIN public.event_registrations r ON e.id = r.event_id
  GROUP BY e.id, e.title;
$$;
