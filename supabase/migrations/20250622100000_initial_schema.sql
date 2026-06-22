-- Nikolman initial schema
-- Run in Supabase SQL Editor or via Supabase CLI migrations.

create extension if not exists pgcrypto;

create type publish_status as enum ('draft', 'published');

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  image_url text not null,
  category_key text not null check (
    category_key in ('industrial', 'residential', 'commercial', 'institutional')
  ),
  year text not null,
  metric text not null,
  featured boolean not null default false,
  sort_order integer not null default 0,
  status publish_status not null default 'draft',
  title jsonb not null,
  description jsonb not null,
  project_status jsonb not null,
  location jsonb not null,
  scope jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  image_url text not null,
  category_key text not null check (
    category_key in ('projectNews', 'companyNews', 'innovation', 'pressRelease')
  ),
  company_key text not null check (
    company_key in ('nikolmanGroup', 'nikolmanConcrete', 'nikolmanProjects')
  ),
  published_at date not null,
  status publish_status not null default 'draft',
  title jsonb not null,
  summary jsonb not null,
  body jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  locale text not null default 'en',
  created_at timestamptz not null default now()
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  locale text not null default 'en',
  created_at timestamptz not null default now()
);

create table public.admin_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

create index projects_status_sort_idx on public.projects (status, sort_order, year desc);
create index articles_status_published_idx on public.articles (status, published_at desc);
create index contact_submissions_email_created_idx on public.contact_submissions (email, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create trigger articles_set_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.articles enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.admin_profiles enable row level security;

create policy "Public can read published projects"
on public.projects
for select
to anon, authenticated
using (status = 'published');

create policy "Public can read published articles"
on public.articles
for select
to anon, authenticated
using (status = 'published');

create policy "Admins manage projects"
on public.projects
for all
to authenticated
using (
  exists (
    select 1
    from public.admin_profiles ap
    where ap.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.admin_profiles ap
    where ap.user_id = auth.uid()
  )
);

create policy "Admins manage articles"
on public.articles
for all
to authenticated
using (
  exists (
    select 1
    from public.admin_profiles ap
    where ap.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.admin_profiles ap
    where ap.user_id = auth.uid()
  )
);

create policy "Admins read contact submissions"
on public.contact_submissions
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_profiles ap
    where ap.user_id = auth.uid()
  )
);

create policy "Admins read newsletter subscribers"
on public.newsletter_subscribers
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_profiles ap
    where ap.user_id = auth.uid()
  )
);

create policy "Users read own admin profile"
on public.admin_profiles
for select
to authenticated
using (user_id = auth.uid());

create policy "Admins manage admin profiles"
on public.admin_profiles
for all
to authenticated
using (
  exists (
    select 1
    from public.admin_profiles ap
    where ap.user_id = auth.uid() and ap.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.admin_profiles ap
    where ap.user_id = auth.uid() and ap.role = 'admin'
  )
);

-- Inserts for contact/newsletter go through Next.js API routes with service_role key.
-- Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
