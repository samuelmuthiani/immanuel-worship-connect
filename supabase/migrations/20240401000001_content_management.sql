-- Create posts table for the Blog
CREATE TABLE public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT, -- Markdown or HTML
    excerpt TEXT,
    cover_image TEXT,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Search index for posts
CREATE INDEX posts_slug_idx ON public.posts (slug);

-- Enable RLS for posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Post Policies
-- Everyone can read published posts
CREATE POLICY "Public can view published posts" ON public.posts
    FOR SELECT
    USING (published = true);

-- Admins can view all posts (including drafts)
CREATE POLICY "Admins can view all posts" ON public.posts
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Admins can insert/update/delete posts
CREATE POLICY "Admins can manage posts" ON public.posts
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );


-- Create sermons table
CREATE TABLE public.sermons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT, -- YouTube/Vimeo link
    audio_url TEXT, -- Podcast link
    speaker TEXT,
    series TEXT,
    date_preached DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for sermons
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;

-- Sermon Policies
-- Everyone can read sermons
CREATE POLICY "Public can view sermons" ON public.sermons
    FOR SELECT
    USING (true);

-- Admins can manage sermons
CREATE POLICY "Admins can manage sermons" ON public.sermons
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Create storage bucket for blog images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for blog-images
CREATE POLICY "Public can view blog images" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'blog-images');

CREATE POLICY "Admins can upload blog images" ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'blog-images' AND
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );
