-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    bio TEXT,
    address TEXT,
    date_of_birth DATE,
    ministry TEXT,
    gender TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Re-apply policies (safely)
DO $$
BEGIN
    -- 1. Admins can read all profiles
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Admins can read all profiles' AND tablename = 'profiles'
    ) THEN
        CREATE POLICY "Admins can read all profiles" ON public.profiles
        FOR SELECT TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM public.user_roles
                WHERE user_id = auth.uid() AND role = 'admin'
            )
        );
    END IF;

    -- 2. Users can read own profile
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Users can read own profile' AND tablename = 'profiles'
    ) THEN
        CREATE POLICY "Users can read own profile" ON public.profiles
        FOR SELECT TO authenticated
        USING (auth.uid() = id);
    END IF;

    -- 3. Users can update own profile
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile' AND tablename = 'profiles'
    ) THEN
        CREATE POLICY "Users can update own profile" ON public.profiles
        FOR UPDATE TO authenticated
        USING (auth.uid() = id);
    END IF;
    
    -- 4. Users can insert own profile (for initial creation if trigger fails)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own profile' AND tablename = 'profiles'
    ) THEN
        CREATE POLICY "Users can insert own profile" ON public.profiles
        FOR INSERT TO authenticated
        WITH CHECK (auth.uid() = id);
    END IF;
END
$$;

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Public can view avatars' AND tablename = 'objects'
    ) THEN
        CREATE POLICY "Public can view avatars" ON storage.objects
        FOR SELECT
        USING (bucket_id = 'avatars');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Users can upload own avatar' AND tablename = 'objects'
    ) THEN
        CREATE POLICY "Users can upload own avatar" ON storage.objects
        FOR INSERT TO authenticated
        WITH CHECK (bucket_id = 'avatars' AND auth.uid() = owner);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own avatar' AND tablename = 'objects'
    ) THEN
        CREATE POLICY "Users can update own avatar" ON storage.objects
        FOR UPDATE TO authenticated
        USING (bucket_id = 'avatars' AND auth.uid() = owner);
    END IF;
END
$$;
