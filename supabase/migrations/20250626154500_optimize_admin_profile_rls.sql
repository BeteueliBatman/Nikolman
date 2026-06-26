-- Optimize RLS evaluation plan for own-profile reads.

drop policy if exists "Users read own website admin profile" on public.website_admin_profiles;

create policy "Users read own website admin profile"
on public.website_admin_profiles
for select
to authenticated
using (user_id = (select auth.uid()));
