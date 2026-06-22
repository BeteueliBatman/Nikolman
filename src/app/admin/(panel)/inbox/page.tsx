import { getContactSubmissions } from "@/lib/admin/inbox";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function AdminInboxPage() {
  const messages = await getContactSubmissions();

  return (
    <section className="admin-page">
      <div className="admin-page__header">
        <span className="eyebrow">Inbox</span>
        <h1>Contact messages</h1>
        <p className="admin-page__lead">
          Submissions from the public contact form. Read-only inbox for your team.
        </p>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Locale</th>
            </tr>
          </thead>
          <tbody>
            {messages.length ? (
              messages.map((message) => (
                <tr key={message.id}>
                  <td>{formatDate(message.created_at)}</td>
                  <td>{message.name}</td>
                  <td>
                    <a href={`mailto:${message.email}`}>{message.email}</a>
                  </td>
                  <td>{message.phone || "—"}</td>
                  <td>{message.subject || "—"}</td>
                  <td className="admin-table__message">{message.message}</td>
                  <td>{message.locale}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="admin-table__empty">
                  No contact messages yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
