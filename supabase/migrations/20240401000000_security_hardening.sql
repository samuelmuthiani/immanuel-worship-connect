-- Create user_roles table if it doesn't exist
create table if not exists public.user_roles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  role text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, role)
);

-- Enable RLS
alter table public.user_roles enable row level security;
alter table public.profiles enable row level security;

-- Policies for user_roles
-- 1. Admins can do everything
create policy "Admins can do everything on user_roles"
  on public.user_roles
  for all
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- 2. Users can read their own roles
create policy "Users can read their own roles"
  on public.user_roles
  for select
  using (auth.uid() = user_id);

-- Policies for profiles
-- 1. Admins can read all profiles
create policy "Admins can read all profiles"
  on public.profiles
  for select
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- 2. Users can read/update their own profile
create policy "Users can read own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- Function to handle new user signup (optional, but good for assigning default role)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, first_name, last_name)
  values (new.id, new.email, '', '');
  
  -- Assign default 'member' role
  insert into public.user_roles (user_id, role)
  values (new.id, 'member');
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
