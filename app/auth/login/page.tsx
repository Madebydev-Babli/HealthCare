"use client";

import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.ok) {
        const session = await getSession();

        if (session?.user?.role === "admin") {
          router.push("/dashboard/admin");
        } else if (session?.user?.role === "patient") {
          router.push("/dashboard/patient");
        } else {
          router.push("/dashboard/doctor");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center">
      <div className="mx-auto w-full max-w-5xl p-6">
        <div className="grid grid-cols-1 gap-8 rounded-3xl bg-white shadow-md md:grid-cols-2 overflow-hidden">
          {/* Left visual */}
          <div className="hidden flex-col gap-6 bg-gradient-to-b from-cyan-600 to-blue-600 p-10 text-white md:flex">
            <h2 className="text-3xl font-bold">Welcome back</h2>
            <p className="text-sm text-cyan-100/90">Securely access your appointments and healthcare records.</p>
            <div className="mt-auto">
              <p className="text-xs">Need help?</p>
              <p className="text-xs">Contact support via support@carebridge.com</p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <h3 className="text-2xl font-semibold">Sign in to your account</h3>
            <p className="mt-2 text-sm text-slate-500">Enter your credentials to continue.</p>

            <div className="mt-6 space-y-4">
              <label className="flex flex-col">
                <span className="mb-2 text-sm font-medium text-slate-700">Email</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-3" />
              </label>

              <label className="flex flex-col">
                <span className="mb-2 text-sm font-medium text-slate-700">Password</span>
                <div className="relative">
                  <input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3 text-sm text-slate-500">{show ? 'Hide' : 'Show'}</button>
                </div>
              </label>
            </div>

            <div className="mt-6">
              <button onClick={handleLogin} disabled={loading} className="w-full rounded-2xl bg-cyan-600 px-4 py-3 font-semibold text-white hover:bg-cyan-700 disabled:opacity-60">{loading ? 'Signing in...' : 'Sign In'}</button>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
              <Link href="/auth/signup" className="text-cyan-600 hover:underline">Create account</Link>
              <Link href="/" className="hover:underline">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
