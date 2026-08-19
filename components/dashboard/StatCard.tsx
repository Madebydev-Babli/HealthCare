"use client";

import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  bg: string;
  change?: string;
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  bg,
  change,
}: Props) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Background Decoration */}
      <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gray-50 transition group-hover:scale-110" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
            {value}
          </h2>

          {change && (
            <span className="mt-4 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
              {change}
            </span>
          )}
        </div>

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl ${bg}`}
        >
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </div>
    </div>
  );
}
