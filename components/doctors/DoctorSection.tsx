"use client";

import { useMemo, useState } from "react";
import { Search, Stethoscope } from "lucide-react";

import DoctorCard from "./DoctorCard";
import DoctorModal from "./DoctorModal";

export default function DoctorsSection({ doctors }: { doctors: any[] }) {
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [search, setSearch] = useState("");

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, doctors]);

  const specialties = [
    "All",
    "Cardiology",
    "Dental",
    "Neurology",
    "Orthopedic",
    "Dermatology",
  ];

  return (
    <>
      <section className="relative -mt-24 z-20 bg-gradient-to-b from-transparent via-cyan-50/50 to-white pb-32">
        <div className="container mx-auto px-6">
          {/* Search Card */}
          <div className="rounded-[32px] border border-white/20 bg-white/80 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
                <Search className="text-cyan-500" size={20} />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search doctor by name..."
                  className="w-full bg-transparent outline-none placeholder:text-slate-400"
                />
              </div>

              <button className="rounded-2xl bg-cyan-500 px-8 py-4 font-medium text-white transition hover:bg-cyan-600">
                Search Doctors
              </button>
            </div>
          </div>

          {/* Header */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-cyan-600">
              <Stethoscope size={16} />
              Our Specialists
            </div>

            <h2 className="mt-5 text-4xl font-bold text-slate-900 md:text-5xl">
              Meet Our Expert Doctors
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
              Experienced and certified healthcare professionals dedicated to
              providing exceptional patient care.
            </p>
          </div>

          {/* Specialties */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {specialties.map((item, index) => (
              <button
                key={item}
                className={`rounded-full px-5 py-3 transition ${
                  index === 0
                    ? "bg-cyan-500 text-white shadow-lg"
                    : "border border-slate-200 bg-white hover:bg-cyan-50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <h3 className="text-3xl font-bold text-cyan-500">
                {doctors.length}+
              </h3>
              <p className="mt-2 text-slate-500">Qualified Specialists</p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <h3 className="text-3xl font-bold text-cyan-500">15K+</h3>
              <p className="mt-2 text-slate-500">Happy Patients</p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <h3 className="text-3xl font-bold text-cyan-500">98%</h3>
              <p className="mt-2 text-slate-500">Satisfaction Rate</p>
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor._id}
                doctor={doctor}
                onView={setSelectedDoctor}
              />
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="mt-20 text-center">
              <h3 className="text-2xl font-semibold text-slate-700">
                No doctors found
              </h3>

              <p className="mt-2 text-slate-500">Try another search keyword.</p>
            </div>
          )}
        </div>
      </section>

      <DoctorModal
        doctor={selectedDoctor}
        open={!!selectedDoctor}
        onOpenChange={() => setSelectedDoctor(null)}
      />
    </>
  );
}
