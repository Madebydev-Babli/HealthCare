"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, Search, Stethoscope } from "lucide-react";

import DoctorCard from "@/components/doctors/DoctorCard";
import DoctorModal from "@/components/doctors/DoctorModal";

export function DoctorsSection() {
  const [doctors, setDoctors] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch("/api/public/doctors");
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setDoctors(data || []);
      } catch (err) {
        console.error(err);
        if (mounted) setDoctors([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="doctors" className="bg-white py-20 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
              <Stethoscope size={16} />
              Meet Our Doctors
            </div>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
              Trusted specialists, ready to care.
            </h2>
          </div>

          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 text-base font-semibold text-cyan-700 transition hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-200"
          >
            View All Doctors
            <ArrowRight size={18} />
          </Link>
        </div>

        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Connect with experienced doctors whose profiles are reviewed and
          approved for patient care.
        </p>

        {loading && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            Loading verified doctors...
          </div>
        )}

        {!loading && doctors?.length === 0 && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            No doctors available right now.
          </div>
        )}

        {doctors && doctors.length > 0 && (
          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {doctors.slice(0, 3).map((doctor) => (
              <div key={doctor._id} className="relative">
                <DoctorCard doctor={doctor} onView={setSelectedDoctor} />
                <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-cyan-500/90 px-3 py-1 text-[11px] font-semibold text-white shadow-lg backdrop-blur-md">
                  <BadgeCheck size={12} />
                  Verified
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 flex items-center justify-center">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-cyan-600 dark:hover:bg-cyan-500"
          >
            <Search size={16} />
            Explore Doctors
          </Link>
        </div>
      </div>

      <DoctorModal
        doctor={selectedDoctor}
        open={!!selectedDoctor}
        onOpenChange={(open: boolean) => {
          if (!open) setSelectedDoctor(null);
        }}
      />
    </section>
  );
}
