-- Content Area Repair & Standardization
-- Description: Standardizes column names across migrations and fixes RLS recursion

-- 1. Standardize Posts Table
DO $$ 
BEGIN 
    -- Rename cover_image to image_url if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'cover_image') THEN
        ALTER TABLE public.posts RENAME COLUMN cover_image TO image_url;
    END IF;

    -- Add missing columns if they don't exist
    ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author TEXT;
    ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS category TEXT;
    ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS excerpt TEXT;
    ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;
    ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS slug TEXT;
END $$;

-- 2. Standardize Sermons Table
DO $$ 
BEGIN 
    -- Rename date_preached to sermon_date if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sermons' AND column_name = 'date_preached') THEN
        ALTER TABLE public.sermons RENAME COLUMN date_preached TO sermon_date;
    END IF;

    -- Add missing columns if they don't exist
    ALTER TABLE public.sermons ADD COLUMN IF NOT EXISTS speaker TEXT;
    ALTER TABLE public.sermons ADD COLUMN IF NOT EXISTS series TEXT;
    ALTER TABLE public.sermons ADD COLUMN IF NOT EXISTS scripture_reference TEXT;
    ALTER TABLE public.sermons ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;
    ALTER TABLE public.sermons ADD COLUMN IF NOT EXISTS audio_url TEXT;
    ALTER TABLE public.sermons ADD COLUMN IF NOT EXISTS video_url TEXT;
    ALTER TABLE public.sermons ADD COLUMN IF NOT EXISTS image_url TEXT;
    ALTER TABLE public.sermons ADD COLUMN IF NOT EXISTS description TEXT;
END $$;

-- 3. Fix RLS Recursion on user_roles
-- We replace the check that calls has_role() with a direct check to avoid infinite loops
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" ON public.user_roles 
FOR ALL TO authenticated 
USING (
  (SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1) = 'admin'
);

-- 4. Standardize RLS for Content Management
-- Ensure admins have full access and public has read access

-- Posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view published posts" ON public.posts;
DROP POLICY IF EXISTS "Published posts are public" ON public.posts;
CREATE POLICY "Public can view published posts" ON public.posts FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Admins can view all posts" ON public.posts;
DROP POLICY IF EXISTS "Admins can manage posts" ON public.posts;
CREATE POLICY "Admins can manage posts" ON public.posts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Sermons
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view sermons" ON public.sermons;
DROP POLICY IF EXISTS "Published sermons are public" ON public.sermons;
CREATE POLICY "Public can view sermons" ON public.sermons FOR SELECT USING (published = true OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can manage sermons" ON public.sermons;
CREATE POLICY "Admins can manage sermons" ON public.sermons FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 5. Repair Storage Deletion Trigger
-- Re-create the trigger to ensure it uses the standardized column names
CREATE OR REPLACE FUNCTION public.log_media_asset_deletion()
RETURNS TRIGGER AS $$
BEGIN
    -- We use a generic approach to handle different tables
    INSERT INTO public.deleted_media_assets (url, bucket)
    VALUES (
        CASE 
            WHEN TG_TABLE_NAME = 'posts' THEN OLD.image_url 
            ELSE OLD.url 
        END,
        'media'
    );
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-apply to media tables
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
