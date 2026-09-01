"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
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

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dashboardHref =
    session?.user.role === "admin"
      ? "/dashboard/admin"
      : session?.user.role === "doctor"
        ? "/dashboard/doctor"
        : "/dashboard/patient";

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-cyan-500/20 backdrop-blur-md">
            <Stethoscope size={22} className="text-cyan-400" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-white">{clinicName}</h1>
            <p className="text-xs text-slate-400">Smart Care</p>
          </div>
        </Link>

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

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/book-appointment"
            className="hidden items-center rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-cyan-600 md:flex"
          >
            Book Appointment
          </Link>

          {session ? (
            <>
              <button className="relative hidden h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white backdrop-blur-md transition hover:bg-white/10 sm:flex">
                <Bell size={18} />
                <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-500" />
              </button>

              <div className="relative hidden md:block">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white backdrop-blur-md transition hover:bg-white/10"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500">
                    <User size={16} />
                  </div>

                  <div className="hidden text-left lg:block">
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
                      <LayoutDashboard size={18} /> Dashboard
                    </Link>

                    <Link
                      href="/dashboard/patient/profile"
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                      <User size={18} /> Profile
                    </Link>

                    <Link
                      href="/appointments"
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                      <Bell size={18} /> My Appointments
                    </Link>

                    <div className="my-2 border-t border-white/10" />

                    <button
                      onClick={() => signOut({ callbackUrl: "/auth/login" })}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition hover:bg-red-500/10"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hidden rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 font-medium text-white backdrop-blur-md transition hover:bg-white/10 sm:inline-flex"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="hidden rounded-xl bg-cyan-500 px-5 py-2.5 font-medium text-white transition hover:bg-cyan-600 sm:inline-flex"
              >
                Sign Up
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white backdrop-blur-md transition hover:bg-white/10 lg:hidden"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 backdrop-blur-xl lg:hidden">
          <div className="space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}

            {session ? (
              <>
                <div className="my-3 border-t border-white/10" />

                <Link
                  href={dashboardHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/5"
                >
                  <LayoutDashboard size={16} /> Dashboard
                </Link>

                <Link
                  href="/appointments"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/5"
                >
                  <Bell size={16} /> My Appointments
                </Link>

                {session.user.role !== "doctor" && (
                  <Link
                    href="/dashboard/patient/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/5"
                  >
                    <User size={16} /> Profile
                  </Link>
                )}

                {session.user.role === "doctor" && (
                  <Link
                    href="/dashboard/doctor/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/5"
                  >
                    <User size={16} /> Profile
                  </Link>
                )}

                <div className="my-2 border-t border-white/10" />

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: "/auth/login" });
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-medium text-white"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-cyan-500 px-4 py-3 text-center text-sm font-medium text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
