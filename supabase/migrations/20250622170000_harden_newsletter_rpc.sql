-- Harden newsletter signup RPC with basic validation and rate limiting.

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
  recent_count integer;
begin
  if normalized_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'invalid_email';
  end if;

  if length(normalized_email) > 320 then
    raise exception 'invalid_email';
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
  values (
    normalized_email,
    coalesce(nullif(trim(p_locale), ''), 'en')
  )
  on conflict (email) do nothing;
end;
$$;
