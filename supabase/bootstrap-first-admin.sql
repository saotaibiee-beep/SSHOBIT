-- SSHOBIT: assign the verified owner account as the first Super Admin.
-- Intended account: saotaibee@gmail.com
-- Run only in the dedicated SSHOBIT Supabase project (tzwfkfvvtimjjwarrvkv).
-- The account must already exist in Authentication > Users and its email must be verified.
-- This script never creates a password or changes authentication credentials.

insert into public.admin_users (user_id, role)
select id, 'super_admin'
from auth.users
where lower(email) = lower('saotaibee@gmail.com')
  and email_confirmed_at is not null
on conflict (user_id) do update
set role = excluded.role;

-- Verification: must return exactly one row.
select au.user_id, au.role, u.email, u.email_confirmed_at, au.created_at
from public.admin_users au
join auth.users u on u.id = au.user_id
where lower(u.email) = lower('saotaibee@gmail.com');
