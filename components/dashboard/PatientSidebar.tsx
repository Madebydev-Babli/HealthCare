"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Home,
  LogOut,
  Stethoscope,
  CalendarDays,
  UserRound,
} from "lucide-react";

export default function PatientSidebar() {
  const pathname = usePathname();

  const links = [
    {
      href: "/dashboard/patient",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/appointments",
      label: "My Appointments",
      icon: CalendarDays,
    },
    {
      href: "/doctors",
      label: "Find Doctors",
      icon: Stethoscope,
    },
    {
      href: "/dashboard/patient/profile",
      label: "Profile",
      icon: UserRound,
    },
  ];

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen">
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/20">
            <Stethoscope size={22} />
          </div>

          <div>
            <p className="text-lg font-bold text-slate-900">Healthcare</p>
            <p className="text-sm text-slate-500">Patient Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

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
