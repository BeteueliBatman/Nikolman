-- Media center assets for the newsroom (images and downloadable documents).

create type website_media_type as enum ('image', 'document');

create table public.website_media_assets (
  id uuid primary key default gen_random_uuid(),
  media_type website_media_type not null,
  file_url text not null,
  file_meta text not null default '',
  sort_order integer not null default 0,
  status website_publish_status not null default 'draft',
  title jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index website_media_assets_status_sort_idx
  on public.website_media_assets (status, sort_order, created_at desc);

create trigger website_media_assets_set_updated_at
before update on public.website_media_assets
for each row execute function public.website_set_updated_at();

alter table public.website_media_assets enable row level security;

create policy "Public can read published website media assets"
on public.website_media_assets
for select
to anon, authenticated
using (status = 'published');

create policy "Website admins manage media assets"
on public.website_media_assets
for all
to authenticated
using (public.is_website_admin())
with check (public.is_website_admin());

-- Allow PDF and ZIP uploads for the media center folder.
update storage.buckets
set
  file_size_limit = 20971520,
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/zip',
    'application/x-zip-compressed'
  ]
where id = 'website-media';
