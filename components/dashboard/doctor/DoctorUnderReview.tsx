"use client";

import { Clock3, ShieldCheck } from "lucide-react";

export default function DoctorUnderReview() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50">
          <Clock3 className="h-10 w-10 text-amber-500" />
        </div>

        {/* Heading */}
        <h1 className="mt-7 text-3xl font-bold text-slate-900">
          Your Profile Is Under Review
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
          Thank you for registering as a doctor. Our admin team is currently
          reviewing your professional information and documents.
        </p>

        {/* Status */}
        <div className="mx-auto mt-7 flex max-w-md items-center gap-3 rounded-2xl bg-amber-50 p-4 text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
            <Clock3 className="h-5 w-5 text-amber-500" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Review in progress
            </p>

            <p className="mt-1 text-xs text-slate-500">
              You'll get access to your doctor dashboard once your profile is
              approved.
            </p>
          </div>
        </div>

        {/* Security */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4" />
          Your information is securely stored
        </div>
      </div>
    </div>
  );
}
