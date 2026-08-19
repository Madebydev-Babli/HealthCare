"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ArrowUpRight,
  HeartPulse,
  Users,
  Award,
} from "lucide-react";

export default function About() {
  const features = [
    "Experienced Medical Specialists",
    "Modern Diagnostic Equipment",
    "Digital Patient Records",
    "Online Appointment Management",
  ];

  return (
    <section className="bg-[#f7f6f3] py-24">
      <div className="container mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="overflow-hidden rounded-[32px]">
              <Image
                src="/clinic.jpg"
                alt="Clinic"
                width={800}
                height={1000}
                className="h-[600px] w-full object-cover"
              />
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-8 left-8 rounded-3xl bg-white p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-cyan-100 p-4">
                  <HeartPulse className="text-cyan-600" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold">15+</h3>
                  <p className="text-gray-500">Years of Excellence</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm uppercase tracking-[0.3em] text-gray-500">
              About Our Clinic
            </span>

            <h2 className="mt-4 text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
              Excellence In
              <br />
              Healthcare With
              <br />
              Compassion
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              We combine modern healthcare technology with personalized patient
              care to provide a seamless clinic experience. From appointments
              and medical records to treatment management, everything is
              designed around patient comfort and efficiency.
            </p>

            <div className="mt-8 grid gap-4">
              {features.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-cyan-600" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <button className="mt-10 flex items-center gap-2 rounded-full bg-black px-7 py-4 text-white transition hover:scale-105">
              Learn More
              <ArrowUpRight size={18} />
            </button>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="mt-32 grid gap-6 md:grid-cols-3">
          <div className="rounded-[30px] bg-white p-8 shadow-sm">
            <Users className="mb-4 text-cyan-600" />

            <h3 className="text-4xl font-bold">25K+</h3>
            <p className="mt-2 text-gray-500">Happy Patients</p>
          </div>

          <div className="rounded-[30px] bg-white p-8 shadow-sm">
            <Award className="mb-4 text-cyan-600" />

            <h3 className="text-4xl font-bold">50+</h3>
            <p className="mt-2 text-gray-500">Medical Experts</p>
          </div>

          <div className="rounded-[30px] bg-white p-8 shadow-sm">
            <HeartPulse className="mb-4 text-cyan-600" />

            <h3 className="text-4xl font-bold">98%</h3>
            <p className="mt-2 text-gray-500">Patient Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  );
}
