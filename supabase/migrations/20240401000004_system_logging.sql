-- Migration: 20240401000004_system_logging.sql
-- Description: Definitions for audit_logs and rate_limits

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'audit_logs') THEN
        CREATE TABLE public.audit_logs (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id),
            action TEXT NOT NULL,
            target TEXT,
            details JSONB,
            timestamp TIMESTAMPTZ DEFAULT now()
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'rate_limits') THEN
        CREATE TABLE public.rate_limits (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            identifier TEXT NOT NULL,
            action TEXT NOT NULL,
            attempts INTEGER DEFAULT 1,
            window_start TIMESTAMPTZ DEFAULT now(),
            created_at TIMESTAMPTZ DEFAULT now(),
            UNIQUE(identifier, action)
        );
    END IF;
END
$$;

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Audit Log Policies
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Rate Limit Policies (Usually handled via Service Role/Edge Functions, but adding safety)
CREATE POLICY "Service Role can manage rate limits" ON public.rate_limits
    FOR ALL USING (true);
