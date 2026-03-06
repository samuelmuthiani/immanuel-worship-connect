-- Add consent_status to newsletter_subscribers for GDPR/compliance
ALTER TABLE public.newsletter_subscribers
ADD COLUMN IF NOT EXISTS consent_status text NOT NULL DEFAULT 'granted';

COMMENT ON COLUMN public.newsletter_subscribers.consent_status IS 'User consent for marketing emails: granted, revoked, pending';

-- Ensure event_registrations has optional user_id for guest vs member distinction
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'event_registrations' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.event_registrations
    ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Public function: return registration counts per event (no PII)
CREATE OR REPLACE FUNCTION public.get_event_registration_counts(event_ids uuid[])
RETURNS TABLE(event_id uuid, registration_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT er.event_id, count(*)::bigint
  FROM public.event_registrations er
  WHERE er.event_id = ANY(event_ids)
  GROUP BY er.event_id;
$$;

-- Allow anon and authenticated to call (read-only counts)
GRANT EXECUTE ON FUNCTION public.get_event_registration_counts(uuid[]) TO anon;
GRANT EXECUTE ON FUNCTION public.get_event_registration_counts(uuid[]) TO authenticated;
