"use client";

import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  CircleCheckBig,
  XCircle,
} from "lucide-react";

type AppointmentOverviewData = {
  total: number;
  pending: number;
  approved: number;
  completed: number;
  cancelled: number;
};

type Props = {
  data: AppointmentOverviewData;
};

export default function AppointmentOverview({ data }: Props) {
  const statusItems = [
    {
      label: "Pending",
      value: data.pending,
      icon: Clock3,
      wrapper: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      valueColor: "text-amber-600",
    },
    {
      label: "Approved",
      value: data.approved,
      icon: CheckCircle2,
      wrapper: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
    },
    {
      label: "Completed",
      value: data.completed,
      icon: CircleCheckBig,
      wrapper: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      valueColor: "text-blue-600",
    },
    {
      label: "Cancelled",
      value: data.cancelled,
      icon: XCircle,
      wrapper: "bg-red-50",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      valueColor: "text-red-600",
    },
  ];

  return (
    <section className="h-full rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
              <CalendarDays className="h-5 w-5 text-blue-600" />
            </div>

            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              Appointment Overview
            </h2>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Track your appointment activity
          </p>
        </div>
      </div>

      {/* Total Appointments */}
      <div className="mt-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Total Appointments
            </p>

            <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
              {data.total}
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
            <CalendarDays className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <p className="mt-3 text-xs font-medium text-blue-600">
          All appointment activity
        </p>
      </div>

      {/* Status Breakdown */}
      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-800">
            Appointment Status
          </p>

          <p className="text-xs text-slate-400">Current overview</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {statusItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className={`rounded-2xl ${item.wrapper} p-4 transition-transform duration-200 hover:-translate-y-0.5`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.iconBg}`}
                  >
                    <Icon className={`h-4 w-4 ${item.iconColor}`} />
                  </div>

                  <span className={`text-2xl font-bold ${item.valueColor}`}>
                    {item.value}
                  </span>
                </div>

                <p className="mt-3 text-xs font-medium text-slate-600">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
