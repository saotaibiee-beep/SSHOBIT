-- SSHOBIT: bootstrap the first administrator safely.
-- 1) Create the intended account in Supabase Dashboard > Authentication > Users.
-- 2) Replace the email below with the exact email of the account YOU control.
-- 3) Run this statement in the SQL Editor for project tzwfkfvvtimjjwarrvkv.
-- Never enable public sign-up for administrator accounts.

insert into public.admin_users (user_id, role)
select id, 'super_admin'
from auth.users
where lower(email) = lower('REPLACE-WITH-YOUR-OWN-EMAIL@example.com')
on conflict (user_id) do update
set role = excluded.role;

-- Verify: this should return exactly one row for the intended account.
select au.user_id, au.role, u.email, au.created_at
from public.admin_users au
join auth.users u on u.id = au.user_id
where lower(u.email) = lower('REPLACE-WITH-YOUR-OWN-EMAIL@example.com');
