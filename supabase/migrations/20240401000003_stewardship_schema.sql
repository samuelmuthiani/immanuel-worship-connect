-- Migration: 20240401000003_stewardship_schema.sql
-- Description: Definitions for donations and appreciations with RLS

-- Create donations table check
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'donations') THEN
        CREATE TABLE public.donations (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) NOT NULL,
            amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
            donation_type TEXT,
            payment_method TEXT,
            transaction_reference TEXT,
            notes TEXT,
            created_at TIMESTAMPTZ DEFAULT now() NOT NULL
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'appreciations') THEN
        CREATE TABLE public.appreciations (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            donation_id UUID REFERENCES public.donations(id) ON DELETE CASCADE NOT NULL,
            sender_id UUID REFERENCES auth.users(id) NOT NULL,
            recipient_id UUID REFERENCES auth.users(id) NOT NULL,
            message TEXT NOT NULL,
            read_at TIMESTAMPTZ,
            sent_at TIMESTAMPTZ DEFAULT now() NOT NULL
        );
    END IF;
END
$$;

-- Enable RLS
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appreciations ENABLE ROW LEVEL SECURITY;

-- Donation Policies
CREATE POLICY "Users can view own donations" ON public.donations
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own donations" ON public.donations
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all donations" ON public.donations
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Appreciation Policies
CREATE POLICY "Users can view appreciations they received" ON public.appreciations
    FOR SELECT TO authenticated
    USING (auth.uid() = recipient_id);

CREATE POLICY "Users can view appreciations they sent" ON public.appreciations
    FOR SELECT TO authenticated
    USING (auth.uid() = sender_id);

CREATE POLICY "Users can send appreciations" ON public.appreciations
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = sender_id);
