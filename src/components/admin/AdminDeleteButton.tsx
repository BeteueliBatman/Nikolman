"use client";

import { useTransition } from "react";

type AdminDeleteButtonProps = {
  id: string;
  action: (formData: FormData) => Promise<void>;
  label: string;
};

export default function AdminDeleteButton({
  id,
  action,
  label,
}: AdminDeleteButtonProps) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete this ${label}? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    const formData = new FormData();
    formData.append("id", id);

    startTransition(() => {
      void action(formData);
    });
  }

  return (
    <button
      type="button"
      className="admin-button admin-button--danger"
      onClick={handleDelete}
      disabled={pending}
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
