-- Create page_views table for simple analytics
CREATE TABLE IF NOT EXISTS public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  referrer text,
  user_id uuid REFERENCES auth.users(id),
  ip_hash text, -- Hashed IP for privacy
  user_agent text,
  viewed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Allow public to insert page views
CREATE POLICY "public_insert_page_views" ON public.page_views FOR INSERT WITH CHECK (true);

-- Allow admin to select all page views
CREATE POLICY "admin_select_all_page_views" ON public.page_views FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
