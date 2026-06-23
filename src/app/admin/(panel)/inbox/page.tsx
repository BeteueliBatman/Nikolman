import AdminInboxBoard from "@/components/admin/AdminInboxBoard";
import { getContactSubmissions } from "@/lib/admin/inbox";

export default async function AdminInboxPage() {
  const messages = await getContactSubmissions();

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <span className="eyebrow">Inbox</span>
        <h1>Contact messages</h1>
        <p className="admin-page__lead">
          Filter submissions, copy email addresses, and remove processed messages.
        </p>
      </div>

      <AdminInboxBoard messages={messages} />
    </section>
  );
}
