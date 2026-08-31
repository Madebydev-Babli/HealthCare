"use client";

import { ArrowRight, CheckCircle2, Lock, Mail, UserRound, ShieldCheck } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Signup() {
  const [role, setRole] = useState("patient");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    try {
      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!signupRes.ok) {
        const message = await signupRes.text();
        setError(message || "Signup failed. Please try again.");
        return;
      }

      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!loginRes?.ok) {
        setError("Account created. Please sign in manually.");
        router.push("/auth/login");
        return;
      }

      router.push(role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient");
    } catch (err) {
      setError("Unable to create your account right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="grid gap-0 md:grid-cols-2">
          <div className="hidden flex-col justify-between bg-gradient-to-br from-emerald-600 via-cyan-600 to-blue-700 p-8 text-white md:flex">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-50">
                <ShieldCheck size={14} /> Healthcare
              </div>
              <h1 className="mt-8 text-4xl font-bold leading-tight">Create your account</h1>
              <p className="mt-4 max-w-sm text-sm text-cyan-50/90">
                Join Healthcare and manage appointments, care plans, and professional records securely.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-100">Your role</p>
              <p className="mt-2 text-sm text-white">Choose how you want to use Healthcare.</p>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">Sign up</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">Create a Healthcare account</h2>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setRole("patient")}
                  className={`rounded-2xl border p-4 text-left transition ${role === "patient" ? "border-cyan-300 bg-cyan-50" : "border-slate-200 bg-slate-50 hover:bg-slate-100"}`}
                >
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <UserRound size={16} className="text-cyan-600" /> Patient
                  </div>
                  <p className="mt-2 text-sm text-slate-500">Book appointments and manage your health.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("doctor")}
                  className={`rounded-2xl border p-4 text-left transition ${role === "doctor" ? "border-cyan-300 bg-cyan-50" : "border-slate-200 bg-slate-50 hover:bg-slate-100"}`}
                >
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <CheckCircle2 size={16} className="text-cyan-600" /> Doctor
                  </div>
                  <p className="mt-2 text-sm text-slate-500">Manage your practice and patient schedules.</p>
                </button>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Full name</span>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input name="name" required placeholder="Enter your full name" className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white" />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Email address</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input name="email" type="email" required placeholder="name@example.com" className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white" />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input name="password" type="password" required placeholder="Create a password" className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white" />
                </div>
              </label>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full rounded-2xl bg-cyan-600 px-4 py-3.5 text-base font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/auth/login" className="font-medium text-cyan-700 transition hover:text-cyan-600">Already have an account? Sign in</Link>
              <Link href="/" className="font-medium text-slate-600 transition hover:text-slate-900">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
