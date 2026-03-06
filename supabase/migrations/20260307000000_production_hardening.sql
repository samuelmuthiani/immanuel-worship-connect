
-- 1. Create consent_records table for tracking terms/privacy acceptance
CREATE TABLE IF NOT EXISTS public.consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    consent_type TEXT NOT NULL, -- 'terms_and_conditions', 'privacy_policy', 'newsletter'
    status TEXT NOT NULL DEFAULT 'granted', -- 'granted', 'revoked'
    ip_address TEXT,
    user_agent TEXT,
    accepted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for consent_records
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;

-- Admins can view all consent records
CREATE POLICY "Admins can view all consent records" 
ON public.consent_records FOR SELECT 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

-- Users can view their own consent records
CREATE POLICY "Users can view own consent records" 
ON public.consent_records FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Anyone can insert a consent record (for signup/newsletter)
CREATE POLICY "Anyone can insert consent records" 
ON public.consent_records FOR INSERT 
WITH CHECK (true);

-- 2. Repair newsletter_subscribers table
-- Ensure name and ip_address exist
ALTER TABLE public.newsletter_subscribers 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS ip_address TEXT;

-- 3. Repair event_registrations table
-- Ensure ip_address exists
ALTER TABLE public.event_registrations 
ADD COLUMN IF NOT EXISTS ip_address TEXT;

-- 4. Improve handle_new_user trigger to assign default role correctly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''), 
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name);
  
  -- Assign default 'user' role if none exists
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Record initial consent if provided in metadata
  IF NEW.raw_user_meta_data->>'accepted_terms' = 'true' THEN
    INSERT INTO public.consent_records (user_id, email, consent_type, status)
    VALUES (NEW.id, NEW.email, 'terms_and_conditions', 'granted');
  END IF;

  RETURN NEW;
END;
$$;

-- 5. Add strict validation check for event registrations (prevent double registration for same email/event)
-- We don't want a unique constraint because someone might register twice if they made a mistake, 
-- but we can add a policy or trigger if needed. For now, let's just ensure RLS is solid.

-- 6. Add policy for users to see their own registrations
CREATE POLICY "Users can view own registrations" 
ON public.event_registrations FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- 7. Audit Log triggers for security sensitive tables
CREATE OR REPLACE FUNCTION public.log_security_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, details)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME::text,
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.id::text 
      ELSE NEW.id::text 
    END,
    jsonb_build_object('timestamp', now(), 'ip', current_setting('request.headers', true)::jsonb->>'x-forwarded-for')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply security logging to user_roles
DROP TRIGGER IF EXISTS log_user_roles_change ON public.user_roles;
CREATE TRIGGER log_user_roles_change
AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.log_security_event();
