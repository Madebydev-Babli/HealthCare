"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Users, Stethoscope, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/clinic.jpg"
          alt="Clinic"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="flex min-h-screen items-center">
          <div className="max-w-3xl text-white">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md"
            >
               Clinic Management System
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-5xl font-bold leading-tight md:text-7xl"
            >
              Modern Healthcare
              <br />
              <span className="text-cyan-400">Management</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 max-w-xl text-lg text-gray-200"
            >
              Manage appointments, doctors, patients, billing, prescriptions and
              reports from a single dashboard.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <button className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-4 font-semibold text-white transition hover:bg-cyan-600">
                Book Appointment
                <ArrowRight size={18} />
              </button>

              <button className="rounded-xl border border-white/20 bg-white/10 px-6 py-4 backdrop-blur-md">
                Explore Services
              </button>
            </motion.div>

            {/* Stats */}
            <div className="mt-12 flex flex-wrap gap-8">
              <div>
                <h3 className="text-3xl font-bold">10K+</h3>
                <p className="text-gray-300">Patients</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">50+</h3>
                <p className="text-gray-300">Doctors</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">98%</h3>
                <p className="text-gray-300">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Card */}
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
        className="absolute bottom-16 right-10 hidden w-96 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl lg:block"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-cyan-500/20 p-3">
            <Calendar className="text-cyan-400" />
          </div>

          <div>
            <h3 className="font-semibold text-white">Today's Appointments</h3>
            <p className="text-sm text-gray-300">24 Scheduled Visits</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-white font-medium">Dr. Sarah Johnson</p>
            <p className="text-sm text-gray-300">
              Dental Consultation • 10:30 AM
            </p>
          </div>

          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-white font-medium">Emergency Checkup</p>
            <p className="text-sm text-gray-300">Room 02 • 11:15 AM</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
