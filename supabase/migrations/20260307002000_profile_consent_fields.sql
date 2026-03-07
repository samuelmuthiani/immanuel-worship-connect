-- Add consent fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS terms_accepted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS privacy_accepted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS accepted_at timestamptz;

-- Update handle_new_user trigger to populate profiles with consent data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  terms_val boolean;
  privacy_val boolean;
  accepted_at_val timestamptz;
BEGIN
  terms_val := (NEW.raw_user_meta_data->>'accepted_terms')::boolean;
  privacy_val := (NEW.raw_user_meta_data->>'accepted_privacy')::boolean;
  
  IF terms_val OR privacy_val THEN
    accepted_at_val := now();
  ELSE
    accepted_at_val := NULL;
  END IF;

  INSERT INTO public.profiles (
    user_id, 
    email, 
    first_name, 
    last_name, 
    terms_accepted, 
    privacy_accepted, 
    accepted_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(terms_val, false),
    COALESCE(privacy_val, false),
    accepted_at_val
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
    terms_accepted = EXCLUDED.terms_accepted,
    privacy_accepted = EXCLUDED.privacy_accepted,
    accepted_at = EXCLUDED.accepted_at;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Record initial consent in consent_records table as well for legal audit trail
  IF terms_val THEN
    INSERT INTO public.consent_records (user_id, email, consent_type, status, accepted_at)
    VALUES (NEW.id, NEW.email, 'terms_and_conditions', 'granted', accepted_at_val);
  END IF;

  IF privacy_val THEN
    INSERT INTO public.consent_records (user_id, email, consent_type, status, accepted_at)
    VALUES (NEW.id, NEW.email, 'privacy_policy', 'granted', accepted_at_val);
  END IF;

  RETURN NEW;
END;
$$;
