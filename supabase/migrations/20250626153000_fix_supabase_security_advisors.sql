-- Resolve high-signal Supabase advisor warnings.
-- 1) Set fixed search_path on trigger helper function.
-- 2) Remove broad public object listing policy on storage bucket.
-- 3) Restrict internal SECURITY DEFINER helpers to authenticated role only.

alter function public.website_set_updated_at() set search_path = public;

drop policy if exists "Public read website media" on storage.objects;

revoke all on function public.get_website_admin_role() from public, anon;
grant execute on function public.get_website_admin_role() to authenticated;

revoke all on function public.is_website_admin() from public, anon;
revoke all on function public.is_website_admin_with_role(text) from public, anon;
grant execute on function public.is_website_admin() to authenticated;
grant execute on function public.is_website_admin_with_role(text) to authenticated;
