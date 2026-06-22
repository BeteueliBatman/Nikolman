-- Secure public form writes without exposing service_role on Vercel.
-- API routes call these RPCs with the anon key after server-side validation.

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
  recent_count integer;
begin
  if length(trim(p_name)) < 2 or length(trim(p_message)) < 10 then
    raise exception 'invalid_payload';
  end if;

  select count(*)::integer
  into recent_count
  from public.contact_submissions
  where lower(email) = lower(trim(p_email))
    and created_at >= now() - interval '1 hour';

  if recent_count >= 5 then
    raise exception 'rate_limited';
  end if;

  insert into public.contact_submissions (
    name, email, phone, subject, message, locale
  ) values (
    trim(p_name),
    lower(trim(p_email)),
    nullif(trim(p_phone), ''),
    nullif(trim(p_subject), ''),
    trim(p_message),
    coalesce(nullif(trim(p_locale), ''), 'en')
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
begin
  insert into public.newsletter_subscribers (email, locale)
  values (lower(trim(p_email)), coalesce(nullif(trim(p_locale), ''), 'en'))
  on conflict (email) do nothing;
end;
$$;

revoke all on function public.submit_contact_message(text, text, text, text, text, text) from public;
revoke all on function public.subscribe_newsletter_email(text, text) from public;

grant execute on function public.submit_contact_message(text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.subscribe_newsletter_email(text, text) to anon, authenticated;
