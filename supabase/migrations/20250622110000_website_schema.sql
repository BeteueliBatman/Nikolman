-- Nikolman marketing website tables (separate from CRM `projects` table)

create type website_publish_status as enum ('draft', 'published');

create table public.website_projects (
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
  status website_publish_status not null default 'draft',
  title jsonb not null,
  description jsonb not null,
  project_status jsonb not null,
  location jsonb not null,
  scope jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.website_articles (
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
  status website_publish_status not null default 'draft',
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

create table public.website_admin_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

create index website_projects_status_sort_idx
  on public.website_projects (status, sort_order, year desc);

create index website_articles_status_published_idx
  on public.website_articles (status, published_at desc);

create index contact_submissions_email_created_idx
  on public.contact_submissions (email, created_at desc);

create or replace function public.website_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger website_projects_set_updated_at
before update on public.website_projects
for each row execute function public.website_set_updated_at();

create trigger website_articles_set_updated_at
before update on public.website_articles
for each row execute function public.website_set_updated_at();

alter table public.website_projects enable row level security;
alter table public.website_articles enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.website_admin_profiles enable row level security;

create policy "Public can read published website projects"
on public.website_projects
for select
to anon, authenticated
using (status = 'published');

create policy "Public can read published website articles"
on public.website_articles
for select
to anon, authenticated
using (status = 'published');

create policy "Website admins manage projects"
on public.website_projects
for all
to authenticated
using (
  exists (
    select 1
    from public.website_admin_profiles ap
    where ap.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.website_admin_profiles ap
    where ap.user_id = auth.uid()
  )
);

create policy "Website admins manage articles"
on public.website_articles
for all
to authenticated
using (
  exists (
    select 1
    from public.website_admin_profiles ap
    where ap.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.website_admin_profiles ap
    where ap.user_id = auth.uid()
  )
);

create policy "Website admins read contact submissions"
on public.contact_submissions
for select
to authenticated
using (
  exists (
    select 1
    from public.website_admin_profiles ap
    where ap.user_id = auth.uid()
  )
);

create policy "Website admins read newsletter subscribers"
on public.newsletter_subscribers
for select
to authenticated
using (
  exists (
    select 1
    from public.website_admin_profiles ap
    where ap.user_id = auth.uid()
  )
);

create policy "Users read own website admin profile"
on public.website_admin_profiles
for select
to authenticated
using (user_id = auth.uid());

create policy "Website admins manage admin profiles"
on public.website_admin_profiles
for all
to authenticated
using (
  exists (
    select 1
    from public.website_admin_profiles ap
    where ap.user_id = auth.uid() and ap.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.website_admin_profiles ap
    where ap.user_id = auth.uid() and ap.role = 'admin'
  )
);
