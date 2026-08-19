"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Clock3,
  User,
  LogOut,
  Stethoscope,
} from "lucide-react";

const links = [
  {
    href: "/dashboard/doctor",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/doctor/appointments",
    label: "Appointments",
    icon: Calendar,
  },
  {
    href: "/dashboard/doctor/patients",
    label: "Patients",
    icon: Users,
  },
  {
    href: "/dashboard/doctor/prescriptions",
    label: "Prescriptions",
    icon: FileText,
  },
  {
    href: "/dashboard/doctor/availability",
    label: "Availability",
    icon: Clock3,
  },
  {
    href: "/dashboard/doctor/profile",
    label: "Profile",
    icon: User,
  },
];

export default function DoctorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="border-b p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-500 p-3 text-white">
            <Stethoscope size={22} />
          </div>

          <div>
            <h2 className="font-bold">Doctor Panel</h2>
            <p className="text-sm text-slate-500">Healthcare Dashboard</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                  pathname === link.href
                    ? "bg-cyan-500 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={20} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t p-4">
        <button className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-red-500 hover:bg-red-50">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
