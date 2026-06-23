-- Allow website admins to delete contact form submissions from the inbox.

create policy "Website admins delete contact submissions"
on public.contact_submissions
for delete
to authenticated
using (public.is_website_admin());
