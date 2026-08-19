"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Search, ArrowRight, Stethoscope } from "lucide-react";

export default function DoctorHero() {
  return (
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

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="flex min-h-[85vh] items-center">
          <div className="max-w-3xl text-white">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md"
            >
              <Stethoscope size={16} />
              Trusted Medical Specialists
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-5xl font-bold leading-tight md:text-7xl"
            >
              Find The Right
              <br />
              <span className="text-cyan-400">Doctor For You</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 max-w-xl text-lg text-gray-200"
            >
              Connect with experienced and verified healthcare professionals.
              Schedule appointments effortlessly and receive quality care.
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex max-w-xl items-center overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl"
            >
              <input
                type="text"
                placeholder="Search doctor, specialty..."
                className="flex-1 bg-transparent px-5 py-4 text-white placeholder:text-gray-300 outline-none"
              />

              <button className="m-2 flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-medium text-white hover:bg-cyan-600">
                <Search size={18} />
                Search
              </button>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 flex flex-wrap gap-4"
            >
              <button className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-4 font-semibold text-white hover:bg-cyan-600">
                Book Appointment
                <ArrowRight size={18} />
              </button>

              <button className="rounded-xl border border-white/20 bg-white/10 px-6 py-4 backdrop-blur-md">
                Browse Doctors
              </button>
            </motion.div>

            {/* Stats */}
            <div className="mt-12 flex flex-wrap gap-8">
              <div>
                <h3 className="text-3xl font-bold">200+</h3>
                <p className="text-gray-300">Doctors</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">15K+</h3>
                <p className="text-gray-300">Patients</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">98%</h3>
                <p className="text-gray-300">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Card */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-16 right-10 hidden w-80 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl lg:block"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-cyan-500/20 p-3">
            <Stethoscope className="text-cyan-400" />
          </div>

          <div>
            <h3 className="font-semibold text-white">Available Specialists</h3>
            <p className="text-sm text-gray-300">40+ Doctors Online</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl bg-white/10 p-4">
            <p className="font-medium text-white">Cardiology Department</p>
            <p className="text-sm text-gray-300">12 Specialists Available</p>
          </div>

          <div className="rounded-xl bg-white/10 p-4">
            <p className="font-medium text-white">Neurology Department</p>
            <p className="text-sm text-gray-300">8 Specialists Available</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
