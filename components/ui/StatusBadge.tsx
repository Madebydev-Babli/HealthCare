"use client";

export function StatusBadge({ status }: { status: string }) {
  const normalized = (status || "").toLowerCase();

  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-cyan-100 text-cyan-700",
    confirmed: "bg-emerald-100 text-emerald-700",
    rejected: "bg-slate-200 text-slate-700",
    cancelled: "bg-slate-200 text-slate-700",
    completed: "bg-emerald-100 text-emerald-700",
  };

  const cls = map[normalized] || "bg-slate-100 text-slate-800";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${cls}`}
    >
      {normalized || "pending"}
    </span>
  );
}

export default StatusBadge;
