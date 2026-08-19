"use client";

import { LucideIcon, ArrowUpRight } from "lucide-react";

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
    <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Top */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
            {value}
          </h2>
        </div>

        {/* Icon */}
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bg}`}
        >
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>

      {/* Bottom */}
      {change && (
        <div className="mt-5 flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm font-medium text-green-600">
            <ArrowUpRight className="h-4 w-4" />
            {change}
          </div>

          <span className="text-xs text-gray-400">vs last month</span>
        </div>
      )}
    </div>
  );
}
