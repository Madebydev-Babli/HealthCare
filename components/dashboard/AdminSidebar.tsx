"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  User,
  Calendar,
  Home,
  LogOut,
  Stethoscope,
} from "lucide-react";

const links = [
  {
    href: "/dashboard/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/admin/doctors",
    label: "Doctors",
    icon: Stethoscope,
  },
  {
    href: "/dashboard/admin/patients",
    label: "Patients",
    icon: Users,
  },
  {
    href: "/dashboard/admin/appointments",
    label: "Appointments",
    icon: Calendar,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen">
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-500 p-3 text-white">
            <Stethoscope size={22} />
          </div>

          <div>
            <h2 className="font-bold">Admin Panel</h2>
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

      <div className="border-t border-slate-200 p-4 space-y-2">
        <Link
          href="/"
          className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          <Home size={18} />
          Back to Home
        </Link>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
