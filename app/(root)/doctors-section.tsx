import Image from "next/image";

import { doctors } from "@/lib/site-data";

export function DoctorsSection() {
  return (
    <section id="doctors" className="py-20">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-slate-900 dark:text-white">
          Meet Our Doctors
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600 dark:text-slate-300">
          Experienced specialists dedicated to delivering expert and empathetic
          care.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {doctors.map((doctor) => (
            <article
              key={doctor.name}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="relative h-56">
                <Image
                  src={doctor.imageUrl}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {doctor.name}
                </h3>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {doctor.specialization}
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {doctor.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
