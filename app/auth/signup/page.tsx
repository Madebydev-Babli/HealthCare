"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Link from "next/link";

export default function Signup() {
  const [role, setRole] = useState("patient");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    const signupRes = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role,
      }),
    });

    if (!signupRes.ok) {
      const message = await signupRes.text();
      alert(message || "Signup failed");
      setLoading(false);
      return;
    }

    const loginRes = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!loginRes?.ok) {
      alert("Account created. Please login.");
      router.push("/auth/login");
      setLoading(false);
      return;
    }

    router.push(role === "doctor" ? "/dashboard/doctor" : "/dashboard/patient");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center">
      <div className="mx-auto w-full max-w-5xl p-6">
        <div className="grid grid-cols-1 gap-8 rounded-3xl bg-white shadow-md md:grid-cols-2 overflow-hidden">
          <div className="hidden flex-col gap-6 bg-gradient-to-b from-emerald-600 to-cyan-600 p-10 text-white md:flex">
            <h2 className="text-3xl font-bold">Create your account</h2>
            <p className="text-sm text-emerald-100/90">Join CareBridge to manage appointments and healthcare records.</p>
            <div className="mt-auto text-sm">
              <p>Choose the role that best describes you.</p>
            </div>
          </div>

          <form onSubmit={handleSignup} className="p-8">
            <h3 className="text-2xl font-semibold">Sign up</h3>
            <p className="mt-2 text-sm text-slate-500">Create an account to get started.</p>

            <div className="mt-6 grid gap-4">
              <div className="flex gap-3">
                <button type="button" onClick={() => setRole('patient')} className={`flex-1 rounded-xl border px-4 py-3 text-left ${role === 'patient' ? 'bg-cyan-50 border-cyan-200' : 'bg-white'}`}>
                  <div className="font-semibold">Patient</div>
                  <div className="text-sm text-slate-500">Book appointments and manage your health</div>
                </button>

                <button type="button" onClick={() => setRole('doctor')} className={`flex-1 rounded-xl border px-4 py-3 text-left ${role === 'doctor' ? 'bg-cyan-50 border-cyan-200' : 'bg-white'}`}>
                  <div className="font-semibold">Doctor</div>
                  <div className="text-sm text-slate-500">Manage your practice and appointments</div>
                </button>
              </div>

              <input name="name" placeholder="Full name" className="rounded-xl border border-slate-200 px-4 py-3" />
              <input name="email" placeholder="Email" className="rounded-xl border border-slate-200 px-4 py-3" />
              <input name="password" type="password" placeholder="Password" className="rounded-xl border border-slate-200 px-4 py-3" />
            </div>

            <div className="mt-6">
              <button type="submit" disabled={loading} className="w-full rounded-2xl bg-cyan-600 px-4 py-3 font-semibold text-white hover:bg-cyan-700 disabled:opacity-60">{loading ? 'Creating account...' : 'Create Account'}</button>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
              <Link href="/auth/login" className="text-cyan-600 hover:underline">Already have an account? Sign in</Link>
              <Link href="/" className="hover:underline">Back to Home</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
