"use client";

import { useMemo, useState, useTransition } from "react";
import { deleteContactSubmissions } from "@/lib/admin/inbox";
import type { ContactSubmissionRow } from "@/lib/db/types";

type AdminInboxBoardProps = {
  messages: ContactSubmissionRow[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}

export default function AdminInboxBoard({ messages }: AdminInboxBoardProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [copyNote, setCopyNote] = useState("");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    if (!needle) {
      return messages;
    }

    return messages.filter((message) => {
      const haystack = [
        message.name,
        message.email,
        message.phone ?? "",
        message.subject ?? "",
        message.message,
        message.locale,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [messages, query]);

  const filteredIds = filtered.map((message) => message.id);
  const allFilteredSelected =
    filtered.length > 0 && filtered.every((message) => selected.includes(message.id));

  function toggleOne(id: string) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id]
    );
  }

  function toggleAllFiltered() {
    if (allFilteredSelected) {
      setSelected((current) =>
        current.filter((id) => !filteredIds.includes(id))
      );
      return;
    }

    setSelected((current) => [...new Set([...current, ...filteredIds])]);
  }

  function showCopyNote(text: string) {
    setCopyNote(text);
    window.setTimeout(() => setCopyNote(""), 2000);
  }

  async function handleCopyEmails(emails: string[]) {
    const unique = [...new Set(emails.map((email) => email.trim()).filter(Boolean))];

    if (!unique.length) {
      return;
    }

    await copyText(unique.join(", "));
    showCopyNote(`Copied ${unique.length} email${unique.length === 1 ? "" : "s"}.`);
  }

  function handleDeleteSelected() {
    if (!selected.length) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${selected.length} message${selected.length === 1 ? "" : "s"}? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    const formData = new FormData();
    formData.append("ids", selected.join(","));

    startTransition(() => {
      void deleteContactSubmissions(formData);
    });
  }

  const selectedEmails = messages
    .filter((message) => selected.includes(message.id))
    .map((message) => message.email);

  return (
    <>
      <div className="admin-inbox-toolbar">
        <label className="admin-field admin-inbox-toolbar__search">
          <span>Filter</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email, subject, or message"
          />
        </label>

        <div className="admin-inbox-toolbar__actions">
          <button
            type="button"
            className="admin-button admin-button--ghost"
            onClick={() =>
              void handleCopyEmails(filtered.map((message) => message.email))
            }
            disabled={!filtered.length}
          >
            Copy all visible emails
          </button>
          <button
            type="button"
            className="admin-button admin-button--ghost"
            onClick={() => void handleCopyEmails(selectedEmails)}
            disabled={!selectedEmails.length}
          >
            Copy selected emails
          </button>
          <button
            type="button"
            className="admin-button admin-button--danger"
            onClick={handleDeleteSelected}
            disabled={!selected.length || pending}
          >
            {pending ? "Deleting..." : "Delete selected"}
          </button>
        </div>
      </div>

      {copyNote ? <p className="admin-form-note">{copyNote}</p> : null}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="admin-table__check">
                <input
                  type="checkbox"
                  aria-label="Select all visible messages"
                  checked={allFilteredSelected}
                  onChange={toggleAllFiltered}
                />
              </th>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Locale</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map((message) => (
                <tr key={message.id}>
                  <td className="admin-table__check">
                    <input
                      type="checkbox"
                      aria-label={`Select message from ${message.name}`}
                      checked={selected.includes(message.id)}
                      onChange={() => toggleOne(message.id)}
                    />
                  </td>
                  <td>{formatDate(message.created_at)}</td>
                  <td>{message.name}</td>
                  <td>
                    <a href={`mailto:${message.email}`}>{message.email}</a>
                  </td>
                  <td>{message.phone || "—"}</td>
                  <td>{message.subject || "—"}</td>
                  <td className="admin-table__message">{message.message}</td>
                  <td>{message.locale}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button
                        type="button"
                        className="admin-button admin-button--ghost"
                        onClick={() =>
                          void handleCopyEmails([message.email]).then(() =>
                            showCopyNote("Email copied.")
                          )
                        }
                      >
                        Copy email
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="admin-table__empty">
                  {messages.length
                    ? "No messages match this filter."
                    : "No contact messages yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
