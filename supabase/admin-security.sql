-- SSHOBIT administrator security model
-- Applied to Supabase project: tzwfkfvvtimjjwarrvkv
-- Keep this file as the reviewed SQL source for the live policies.

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.current_admin_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select au.role
  from public.admin_users au
  where au.user_id = (select auth.uid())
  limit 1
$$;
revoke all on function private.current_admin_role() from public, anon;
grant execute on function private.current_admin_role() to authenticated;

grant select, insert, update, delete on public.admin_users to authenticated;
grant select, insert on public.admin_audit_logs to authenticated;
grant select, insert on public.service_request_internal_notes to authenticated;
grant select on public.service_deliveries to authenticated;
grant select on public.payments to authenticated;
grant select on public.payment_events to authenticated;

drop policy if exists "admin users read own or super admin" on public.admin_users;
create policy "admin users read own or super admin" on public.admin_users
for select to authenticated
using (user_id = (select auth.uid()) or private.current_admin_role() = 'super_admin');

drop policy if exists "super admins add admin users" on public.admin_users;
create policy "super admins add admin users" on public.admin_users
for insert to authenticated with check (private.current_admin_role() = 'super_admin');

drop policy if exists "super admins update admin users" on public.admin_users;
create policy "super admins update admin users" on public.admin_users
for update to authenticated
using (private.current_admin_role() = 'super_admin')
with check (private.current_admin_role() = 'super_admin');

drop policy if exists "super admins remove admin users" on public.admin_users;
create policy "super admins remove admin users" on public.admin_users
for delete to authenticated using (private.current_admin_role() = 'super_admin');

drop policy if exists "admins read audit logs" on public.admin_audit_logs;
create policy "admins read audit logs" on public.admin_audit_logs
for select to authenticated
using (private.current_admin_role() in ('super_admin','admin'));

drop policy if exists "admins write own audit logs" on public.admin_audit_logs;
create policy "admins write own audit logs" on public.admin_audit_logs
for insert to authenticated
with check (actor_id = (select auth.uid()) and private.current_admin_role() in ('super_admin','admin','editor','support'));

do $$
declare t text;
begin
  foreach t in array array['articles','article_categories','article_sources','problems','problem_categories','faqs','platforms'] loop
    execute format('drop policy if exists %I on public.%I', 'staff read '||t, t);
    execute format('create policy %I on public.%I for select to authenticated using (private.current_admin_role() in (''super_admin'',''admin'',''editor'',''support''))', 'staff read '||t, t);
    execute format('drop policy if exists %I on public.%I', 'editors manage '||t, t);
    execute format('drop policy if exists %I on public.%I', 'staff insert '||t, t);
    execute format('drop policy if exists %I on public.%I', 'staff update '||t, t);
    execute format('drop policy if exists %I on public.%I', 'admins delete '||t, t);
    execute format('drop policy if exists %I on public.%I', 'admins insert services', t);
  execute format('drop policy if exists %I on public.%I', 'admins update services', t);
  execute format('drop policy if exists %I on public.%I', 'admins delete services', t);
  execute format('create policy %I on public.%I for insert to authenticated with check (private.current_admin_role() in (''super_admin'',''admin'',''editor''))', 'staff insert '||t, t);
    execute format('create policy %I on public.%I for update to authenticated using (private.current_admin_role() in (''super_admin'',''admin'',''editor'')) with check (private.current_admin_role() in (''super_admin'',''admin'',''editor''))', 'staff update '||t, t);
    execute format('create policy %I on public.%I for delete to authenticated using (private.current_admin_role() in (''super_admin'',''admin''))', 'admins delete '||t, t);
  end loop;
  t := 'services';
  execute format('drop policy if exists %I on public.%I', 'staff read '||t, t);
  execute format('create policy %I on public.%I for select to authenticated using (private.current_admin_role() in (''super_admin'',''admin'',''editor'',''support''))', 'staff read '||t, t);
  execute format('drop policy if exists %I on public.%I', 'editors manage '||t, t);
  execute format('create policy %I on public.%I for insert to authenticated with check (private.current_admin_role() in (''super_admin'',''admin''))', 'admins insert services', t);
  execute format('create policy %I on public.%I for update to authenticated using (private.current_admin_role() in (''super_admin'',''admin'')) with check (private.current_admin_role() in (''super_admin'',''admin''))', 'admins update services', t);
  execute format('create policy %I on public.%I for delete to authenticated using (private.current_admin_role() in (''super_admin'',''admin''))', 'admins delete services', t);
end $$;

drop policy if exists "staff read service requests" on public.service_requests;
create policy "staff read service requests" on public.service_requests
for select to authenticated using (private.current_admin_role() in ('super_admin','admin','support'));

drop policy if exists "staff read internal notes" on public.service_request_internal_notes;
create policy "staff read internal notes" on public.service_request_internal_notes
for select to authenticated using (private.current_admin_role() in ('super_admin','admin','support'));

drop policy if exists "staff add internal notes" on public.service_request_internal_notes;
create policy "staff add internal notes" on public.service_request_internal_notes
for insert to authenticated
with check (author_id = (select auth.uid()) and private.current_admin_role() in ('super_admin','admin','support'));

drop policy if exists "admins read payments" on public.payments;
create policy "admins read payments" on public.payments
for select to authenticated using (private.current_admin_role() in ('super_admin','admin'));

drop policy if exists "admins read payment events" on public.payment_events;
create policy "admins read payment events" on public.payment_events
for select to authenticated using (private.current_admin_role() in ('super_admin','admin'));

drop policy if exists "admins read service deliveries" on public.service_deliveries;
create policy "admins read service deliveries" on public.service_deliveries
for select to authenticated using (private.current_admin_role() in ('super_admin','admin','support'));
