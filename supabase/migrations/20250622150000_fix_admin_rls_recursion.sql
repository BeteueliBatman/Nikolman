-- Fix RLS infinite recursion: policies must not query website_admin_profiles
-- directly (that re-triggers RLS). Use security definer helpers instead.

create or replace function public.is_website_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.website_admin_profiles
    where user_id = auth.uid()
  );
$$;

create or replace function public.is_website_admin_with_role(required_role text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.website_admin_profiles
    where user_id = auth.uid()
      and role = required_role
  );
$$;

revoke all on function public.is_website_admin() from public;
revoke all on function public.is_website_admin_with_role(text) from public;
grant execute on function public.is_website_admin() to authenticated, anon;
grant execute on function public.is_website_admin_with_role(text) to authenticated, anon;

drop policy if exists "Website admins manage projects" on public.website_projects;
drop policy if exists "Website admins manage articles" on public.website_articles;
drop policy if exists "Website admins read contact submissions" on public.contact_submissions;
drop policy if exists "Website admins read newsletter subscribers" on public.newsletter_subscribers;
drop policy if exists "Website admins manage admin profiles" on public.website_admin_profiles;

create policy "Website admins manage projects"
on public.website_projects
for all
to authenticated
using (public.is_website_admin())
with check (public.is_website_admin());

create policy "Website admins manage articles"
on public.website_articles
for all
to authenticated
using (public.is_website_admin())
with check (public.is_website_admin());

create policy "Website admins read contact submissions"
on public.contact_submissions
for select
to authenticated
using (public.is_website_admin());

create policy "Website admins read newsletter subscribers"
on public.newsletter_subscribers
for select
to authenticated
using (public.is_website_admin());

create policy "Website admins manage admin profiles"
on public.website_admin_profiles
for all
to authenticated
using (public.is_website_admin_with_role('admin'))
with check (public.is_website_admin_with_role('admin'));

drop policy if exists "Website admins upload media" on storage.objects;
drop policy if exists "Website admins update media" on storage.objects;
drop policy if exists "Website admins delete media" on storage.objects;

create policy "Website admins upload media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'website-media'
  and public.is_website_admin()
);

create policy "Website admins update media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'website-media'
  and public.is_website_admin()
)
with check (
  bucket_id = 'website-media'
  and public.is_website_admin()
);

create policy "Website admins delete media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'website-media'
  and public.is_website_admin()
);
