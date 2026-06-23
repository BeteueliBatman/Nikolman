import AdminSubscribersBoard from "@/components/admin/AdminSubscribersBoard";
import { getNewsletterSubscribers } from "@/lib/admin/subscribers";

export default async function AdminSubscribersPage() {
  const subscribers = await getNewsletterSubscribers();

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <span className="eyebrow">Newsletter</span>
        <h1>Subscribers</h1>
        <p className="admin-page__lead">
          Filter subscribers, copy email addresses, and remove entries when needed.
        </p>
      </div>

      <AdminSubscribersBoard subscribers={subscribers} />
    </section>
  );
}
