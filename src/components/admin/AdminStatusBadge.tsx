import type { PublishStatus } from "@/lib/db/types";

export default function AdminStatusBadge({ status }: { status: PublishStatus }) {
  return (
    <span className={`admin-status admin-status--${status}`}>
      {status}
    </span>
  );
}
