-- Harden public form RPCs and locale integrity at database level.
-- This protects against malformed direct RPC calls that bypass frontend checks.

update public.contact_submissions
set locale = 'en'
where locale not in ('en', 'ka');

update public.newsletter_subscribers
set locale = 'en'
where locale not in ('en', 'ka');

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'contact_submissions_locale_check'
      and conrelid = 'public.contact_submissions'::regclass
  ) then
    alter table public.contact_submissions
      add constraint contact_submissions_locale_check
      check (locale in ('en', 'ka'));
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'newsletter_subscribers_locale_check'
      and conrelid = 'public.newsletter_subscribers'::regclass
  ) then
    alter table public.newsletter_subscribers
      add constraint newsletter_subscribers_locale_check
      check (locale in ('en', 'ka'));
  end if;
end;
$$;

create or replace function public.submit_contact_message(
  p_name text,
  p_email text,
  p_phone text,
  p_subject text,
  p_message text,
  p_locale text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_name text := trim(p_name);
  normalized_email text := lower(trim(p_email));
  normalized_phone text := nullif(trim(p_phone), '');
  normalized_subject text := nullif(trim(p_subject), '');
  normalized_message text := trim(p_message);
  normalized_locale text := coalesce(nullif(trim(p_locale), ''), 'en');
  recent_count integer;
begin
  if length(normalized_name) < 2 or length(normalized_name) > 120 then
    raise exception 'invalid_name';
  end if;

  if normalized_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'invalid_email';
  end if;

  if length(normalized_email) > 254 then
    raise exception 'invalid_email';
  end if;

  if normalized_phone is not null and length(normalized_phone) > 40 then
    raise exception 'invalid_phone';
  end if;

  if normalized_subject is not null and length(normalized_subject) > 120 then
    raise exception 'invalid_subject';
  end if;

  if length(normalized_message) < 10 or length(normalized_message) > 5000 then
    raise exception 'invalid_message';
  end if;

  if normalized_locale not in ('en', 'ka') then
    raise exception 'invalid_locale';
  end if;

  select count(*)::integer
  into recent_count
  from public.contact_submissions
  where lower(email) = normalized_email
    and created_at >= now() - interval '1 hour';

  if recent_count >= 5 then
    raise exception 'rate_limited';
  end if;

  insert into public.contact_submissions (
    name, email, phone, subject, message, locale
  ) values (
    normalized_name,
    normalized_email,
    normalized_phone,
    normalized_subject,
    normalized_message,
    normalized_locale
  );
end;
$$;

create or replace function public.subscribe_newsletter_email(
  p_email text,
  p_locale text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_email text := lower(trim(p_email));
  normalized_locale text := coalesce(nullif(trim(p_locale), ''), 'en');
  recent_count integer;
begin
  if normalized_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'invalid_email';
  end if;

  if length(normalized_email) > 254 then
    raise exception 'invalid_email';
  end if;

  if normalized_locale not in ('en', 'ka') then
    raise exception 'invalid_locale';
  end if;

  select count(*)::integer
  into recent_count
  from public.newsletter_subscribers
  where lower(email) = normalized_email
    and created_at >= now() - interval '1 hour';

  if recent_count >= 3 then
    raise exception 'rate_limited';
  end if;

  insert into public.newsletter_subscribers (email, locale)
  values (normalized_email, normalized_locale)
  on conflict (email) do nothing;
end;
$$;

revoke all on function public.submit_contact_message(text, text, text, text, text, text) from public;
revoke all on function public.subscribe_newsletter_email(text, text) from public;

grant execute on function public.submit_contact_message(text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.subscribe_newsletter_email(text, text) to anon, authenticated;
