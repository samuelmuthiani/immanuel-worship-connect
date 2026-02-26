-- Assign admin role to the existing user
INSERT INTO public.user_roles (user_id, role)
VALUES ('7a795fdc-71a3-456e-9c45-c0ab74f079a5', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;