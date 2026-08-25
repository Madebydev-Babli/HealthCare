"use client";

import { ArrowRight, CheckCircle2, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DoctorProfileSetup() {
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>

        {/* Heading */}
        <h1 className="mt-7 text-3xl font-bold text-slate-900">
          You're Approved 🎉
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
          Your doctor account has been approved by the admin. Complete your
          professional profile so patients can learn more about you.
        </p>

        {/* Profile Card */}
        <div className="mx-auto mt-7 flex max-w-md items-center gap-4 rounded-2xl bg-slate-50 p-5 text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white">
            <UserRound className="h-6 w-6 text-cyan-500" />
          </div>

          <div>
            <p className="font-semibold text-slate-800">
              Complete your profile
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Add your professional information and availability.
            </p>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => router.push("/dashboard/doctor/profile/create")}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-600"
        >
          Create Your Profile
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
