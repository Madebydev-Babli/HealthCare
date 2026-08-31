"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Stethoscope } from "lucide-react";

import DoctorCard from "./DoctorCard";
import DoctorModal from "./DoctorModal";

type Doctor = {
  _id: string;
  name: string;
  image?: string;
  specialization?: string;
  fieldOfMedical?: string;
  experience?: number | string;
  degree?: string;
  consultationFee?: number;
  rating?: number;
  reviews?: number;
};

type Props = {
  doctors: Doctor[];
};

export default function DoctorHero({ doctors }: Props) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const specialties = [
    "All",
    "Cardiology",
    "Dental",
    "Neurology",
    "Orthopedic",
    "Dermatology",
  ];

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const doctorName = doctor.name?.toLowerCase() || "";

      const doctorSpecialization =
        doctor.specialization?.toLowerCase() ||
        doctor.fieldOfMedical?.toLowerCase() ||
        "";

      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        doctorName.includes(searchValue) ||
        doctorSpecialization.includes(searchValue);

      const matchesSpecialty =
        selectedSpecialty === "All" ||
        doctorSpecialization === selectedSpecialty.toLowerCase();

      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, search, selectedSpecialty]);

  return (
    <div className="w-full bg-slate-50">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative min-h-[85vh] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/doc.jpg"
            alt="Doctors"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-7xl items-center px-6 py-20 lg:px-8">
          <div className="max-w-3xl text-white">
            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
            >
              Find The Right
              <br />
              <span className="text-cyan-400">Doctor For You</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-200 md:text-xl"
            >
              Connect with experienced and verified healthcare professionals.
              Schedule appointments effortlessly and receive quality care.
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="mt-8 flex w-full max-w-2xl items-center rounded-2xl border border-white/20 bg-white/10 p-2 backdrop-blur-xl"
            >
              <Search size={20} className="ml-3 shrink-0 text-gray-300" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by doctor name or specialization..."
                className="w-full bg-transparent px-4 py-3 text-white outline-none placeholder:text-gray-400"
              />

              <button
                type="button"
                className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-600"
              >
                Search
              </button>
            </motion.div>

            {/* Hero Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex flex-wrap gap-8"
            >
              <div>
                <p className="text-3xl font-bold">{doctors.length}+</p>

                <p className="mt-1 text-sm text-gray-300">Verified Doctors</p>
              </div>

              <div>
                <p className="text-3xl font-bold">15K+</p>

                <p className="mt-1 text-sm text-gray-300">Happy Patients</p>
              </div>

              <div>
                <p className="text-3xl font-bold">98%</p>

                <p className="mt-1 text-sm text-gray-300">Satisfaction Rate</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          DOCTORS SECTION
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-600">
            <Stethoscope size={16} />
            Our Specialists
          </div>

          <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Meet Our Expert Doctors
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-500">
            Experienced and certified healthcare professionals dedicated to
            providing exceptional patient care.
          </p>
        </div>

        {/* =================================================
            SPECIALTIES
        ================================================= */}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {specialties.map((specialty) => {
            const active = selectedSpecialty === specialty;

            return (
              <button
                key={specialty}
                type="button"
                onClick={() => setSelectedSpecialty(specialty)}
                className={`rounded-full px-5 py-3 text-sm font-medium transition-all ${
                  active
                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-600"
                }`}
              >
                {specialty}
              </button>
            );
          })}
        </div>

        {/* =================================================
            RESULTS INFO
        ================================================= */}

        <div className="mt-10 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">
              Available Doctors
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {filteredDoctors.length} doctor
              {filteredDoctors.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {/* =================================================
            DOCTORS GRID
        ================================================= */}

        {filteredDoctors.length > 0 ? (
          <div className="mt-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor._id}
                doctor={doctor}
                onView={setSelectedDoctor}
              />
            ))}
          </div>
        ) : (
          <div className="mt-16 rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Search className="text-slate-400" size={28} />
            </div>

            <h3 className="mt-5 text-2xl font-semibold text-slate-800">
              No doctors found
            </h3>

            <p className="mt-2 text-slate-500">
              Try searching for another doctor or specialty.
            </p>

            {(search || selectedSpecialty !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedSpecialty("All");
                }}
                className="mt-6 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </section>

      {/* =====================================================
          DOCTOR MODAL
      ===================================================== */}

      <DoctorModal
        doctor={selectedDoctor}
        open={!!selectedDoctor}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setSelectedDoctor(null);
          }
        }}
      />
    </div>
  );
}
