"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function DoctorsSection() {
  const [doctors, setDoctors] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch('/api/public/doctors');
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
    <section id="doctors" className="py-20">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-slate-900 dark:text-white">
          Meet Our Doctors
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600 dark:text-slate-300">
          Experienced specialists dedicated to delivering expert and empathetic care.
        </p>

        {loading && (
          <div className="mt-8 text-center text-slate-500">Loading doctors...</div>
        )}

        {!loading && doctors?.length === 0 && (
          <div className="mt-8 text-center text-slate-600">No doctors available right now.</div>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {doctors?.map((doctor) => (
            <article key={doctor._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <div className="relative h-56">
                <Image src={doctor.image || '/clinic.jpg'} alt={doctor.name} fill className="object-cover" />
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{doctor.name}</h3>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{doctor.fieldOfMedical || doctor.specialization}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{doctor.degree || ''} • {doctor.experience} yrs</p>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="font-semibold">₹{doctor.appointmentFee || doctor.consultationFee || '—'}</p>
                  <a href={`/book-appointment?doctorId=${doctor._id}`} className="rounded-full bg-cyan-500 px-4 py-2 text-white">Book</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
