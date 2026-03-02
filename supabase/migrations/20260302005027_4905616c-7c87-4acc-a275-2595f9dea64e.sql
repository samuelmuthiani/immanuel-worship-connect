
-- Create storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- Allow admins to upload to media bucket
CREATE POLICY "Admins can upload media" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

-- Allow admins to update media
CREATE POLICY "Admins can update media" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete media
CREATE POLICY "Admins can delete media" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

-- Allow public read access to media
CREATE POLICY "Public can view media" ON storage.objects FOR SELECT TO public
USING (bucket_id = 'media');

-- Create table for terms/privacy acceptance tracking
CREATE TABLE IF NOT EXISTS public.policy_acceptances (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  policy_type text NOT NULL CHECK (policy_type IN ('privacy', 'terms')),
  accepted_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, policy_type)
);

ALTER TABLE public.policy_acceptances ENABLE ROW LEVEL SECURITY;

-- Users can insert their own acceptances
CREATE POLICY "Users can insert own acceptance" ON public.policy_acceptances
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Users can view their own acceptances
CREATE POLICY "Users can view own acceptance" ON public.policy_acceptances
FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Admins can view all acceptances
CREATE POLICY "Admins can view all acceptances" ON public.policy_acceptances
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
