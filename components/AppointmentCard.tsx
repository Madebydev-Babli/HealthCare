"use client";

import { StatusBadge } from "@/components/ui/StatusBadge";

export default function AppointmentCard({ appointment }: { appointment: any }) {
  return (
    <div className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div>
        <p className="font-semibold text-slate-900">Dr. {appointment.doctorName}</p>
        <p className="text-sm text-slate-500">{appointment.specialization}</p>
      </div>

      <div className="text-right">
        <p className="font-medium text-slate-900">{appointment.date}</p>
        <p className="text-sm text-slate-500">{appointment.time}</p>
      </div>

      <div>
        <StatusBadge status={appointment.status || "pending"} />
      </div>
    </div>
  );
}
