-- Allow website admins to delete newsletter subscribers from the admin panel.

create policy "Website admins delete newsletter subscribers"
on public.newsletter_subscribers
for delete
to authenticated
using (public.is_website_admin());
