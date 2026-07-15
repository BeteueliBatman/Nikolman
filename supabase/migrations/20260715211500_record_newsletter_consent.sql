-- Record evidence of newsletter consent for new and renewed subscriptions.
-- Existing rows remain null because consent evidence was not captured previously.

alter table public.newsletter_subscribers
  add column if not exists consented_at timestamptz,
  add column if not exists consent_source text,
  add column if not exists privacy_policy_version text;

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

  insert into public.newsletter_subscribers (
    email,
    locale,
    consented_at,
    consent_source,
    privacy_policy_version
  )
  values (
    normalized_email,
    normalized_locale,
    now(),
    'website-newsroom',
    '2026-07-15'
  )
  on conflict (email) do update
  set locale = excluded.locale,
      consented_at = excluded.consented_at,
      consent_source = excluded.consent_source,
      privacy_policy_version = excluded.privacy_policy_version;
end;
$$;

revoke all on function public.subscribe_newsletter_email(text, text) from public;
grant execute on function public.subscribe_newsletter_email(text, text)
  to anon, authenticated;
