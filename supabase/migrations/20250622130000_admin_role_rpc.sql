-- Reliable admin role lookup for authenticated users (avoids RLS timing issues on sign-in).

create or replace function public.get_website_admin_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role
  from public.website_admin_profiles
  where user_id = auth.uid()
  limit 1;
$$;

revoke all on function public.get_website_admin_role() from public;
grant execute on function public.get_website_admin_role() to authenticated;
