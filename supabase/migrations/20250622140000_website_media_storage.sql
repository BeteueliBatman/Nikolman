-- Public media bucket for admin-uploaded project and article images.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'website-media',
  'website-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public read website media"
on storage.objects
for select
to public
using (bucket_id = 'website-media');

create policy "Website admins upload media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'website-media'
  and exists (
    select 1
    from public.website_admin_profiles ap
    where ap.user_id = auth.uid()
  )
);

create policy "Website admins update media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'website-media'
  and exists (
    select 1
    from public.website_admin_profiles ap
    where ap.user_id = auth.uid()
  )
)
with check (
  bucket_id = 'website-media'
  and exists (
    select 1
    from public.website_admin_profiles ap
    where ap.user_id = auth.uid()
  )
);

create policy "Website admins delete media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'website-media'
  and exists (
    select 1
    from public.website_admin_profiles ap
    where ap.user_id = auth.uid()
  )
);
