"use client";

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-slate-100 text-slate-800",
  };

  const cls = map[status?.toLowerCase?.() || ""] || "bg-slate-100 text-slate-800";

  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${cls}`}>{status}</span>;
}

export default StatusBadge;
