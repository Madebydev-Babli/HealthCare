"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  User,
} from "lucide-react";

import { clinicName, navLinks } from "@/lib/site-data";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const dashboardHref =
    session?.user.role === "admin"
      ? "/dashboard/admin"
      : session?.user.role === "doctor"
        ? "/dashboard/doctor"
        : "/dashboard/patient";

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-cyan-500/20 backdrop-blur-md">
            <Stethoscope size={22} className="text-cyan-400" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-white">{clinicName}</h1>

            <p className="text-xs text-slate-400">Smart Care</p>
          </div>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-2 lg:flex">
          {navLinks.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  active
                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link
            href="/book-appointment"
            className="hidden items-center rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-cyan-600 md:flex"
          >
            Book Appointment
          </Link>

          {session ? (
            <>
              {/* Notification */}
              <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white backdrop-blur-md transition hover:bg-white/10">
                <Bell size={18} />

                <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-500" />
              </button>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white backdrop-blur-md transition hover:bg-white/10"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500">
                    <User size={16} />
                  </div>

                  <div className="hidden text-left md:block">
                    <p className="text-sm font-semibold">{session.user.name}</p>

                    <p className="text-xs capitalize text-slate-400">
                      {session.user.role}
                    </p>
                  </div>

                  <ChevronDown size={16} />
                </button>

                {open && (
                  <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl">
                    <div className="border-b border-white/10 px-4 py-3">
                      <p className="font-semibold text-white">
                        {session.user.name}
                      </p>

                      <p className="text-xs capitalize text-slate-400">
                        {session.user.role}
                      </p>
                    </div>

                    <Link
                      href={dashboardHref}
                      className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>

                    <Link
                      href="/profile"
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                      <User size={18} />
                      Profile
                    </Link>

                    <Link
                      href="/appointments"
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                      <Bell size={18} />
                      My Appointments
                    </Link>

                    <div className="my-2 border-t border-white/10" />

                    <button
                      onClick={() =>
                        signOut({
                          callbackUrl: "/auth/login",
                        })
                      }
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition hover:bg-red-500/10"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 font-medium text-white backdrop-blur-md transition hover:bg-white/10"
              >
                Login
              </Link>

              <Link
                href="/auth/signup"
                className="rounded-xl bg-cyan-500 px-5 py-2.5 font-medium text-white transition hover:bg-cyan-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
