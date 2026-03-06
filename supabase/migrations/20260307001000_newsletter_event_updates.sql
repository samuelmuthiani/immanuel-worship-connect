ALTER TABLE public.newsletter_subscribers
ADD COLUMN IF NOT EXISTS consent boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
ADD COLUMN IF NOT EXISTS source_page text;

UPDATE public.newsletter_subscribers
SET created_at = subscribed_at
WHERE created_at IS NULL;

ALTER TABLE public.event_registrations
ADD COLUMN IF NOT EXISTS is_guest boolean NOT NULL DEFAULT false;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'event_registrations'
      AND constraint_type = 'UNIQUE'
      AND constraint_name = 'event_registrations_event_id_email_key'
  ) THEN
    ALTER TABLE public.event_registrations
    ADD CONSTRAINT event_registrations_event_id_email_key UNIQUE (event_id, email);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  IF NEW.raw_user_meta_data->>'accepted_terms' = 'true' THEN
    INSERT INTO public.consent_records (user_id, email, consent_type, status)
    VALUES (NEW.id, NEW.email, 'terms_and_conditions', 'granted');
  END IF;

  IF NEW.raw_user_meta_data->>'accepted_privacy' = 'true' THEN
    INSERT INTO public.consent_records (user_id, email, consent_type, status)
    VALUES (NEW.id, NEW.email, 'privacy_policy', 'granted');
  END IF;

  RETURN NEW;
END;
$$;
