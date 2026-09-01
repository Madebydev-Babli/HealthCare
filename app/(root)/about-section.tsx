"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  ShieldCheck,
  Stethoscope,
  UserRoundPlus,
  Users,
  BriefcaseMedical,
  ClipboardList,
} from "lucide-react";

const patientSteps = [
  {
    icon: Stethoscope,
    title: "Find a Doctor",
    description:
      "Explore verified specialists and choose the right fit for your needs.",
  },
  {
    icon: CalendarCheck2,
    title: "Choose a Time",
    description:
      "Review availability and select a convenient appointment slot.",
  },
  {
    icon: Clock3,
    title: "Book Your Appointment",
    description:
      "Confirm your visit and stay updated with your appointment status.",
  },
];

const doctorSteps = [
  {
    icon: UserRoundPlus,
    title: "Create Your Profile",
    description:
      "Set up your professional profile, qualifications, and availability.",
  },
  {
    icon: CheckCircle2,
    title: "Get Approved by Admin",
    description:
      "Your professional profile is reviewed before you begin managing patients.",
  },
  {
    icon: BriefcaseMedical,
    title: "Manage Appointments and Patients",
    description:
      "Track visits, patient records, and care schedules from one workspace.",
  },
];

const features = [
  {
    icon: CalendarCheck2,
    title: "Easy Appointment Booking",
    description:
      "Patients can discover doctors and schedule appointments without complicated forms or delays.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Doctors",
    description:
      "Patients connect with professionals whose profiles and credentials are reviewed within the platform.",
  },
  {
    icon: ClipboardList,
    title: "Doctor Dashboard",
    description:
      "Doctors can manage appointments, patients, earnings, and profile details from a single dashboard.",
  },
  {
    icon: Users,
    title: "Patient Management",
    description:
      "Doctors can review patient activity and keep their care journey organized.",
  },
  {
    icon: HeartHandshake,
    title: "Appointment Tracking",
    description:
      "Patients and doctors can monitor the status of visits and stay informed.",
  },
  {
    icon: CheckCircle2,
    title: "Secure Healthcare Platform",
    description:
      "Healthcare keeps account access, appointment data, and platform information protected.",
  },
];

export default function About() {
  return (
    <section id="about" className="bg-slate-50 py-20 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-600">
            Healthcare Platform
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Built to connect care, scheduling, and clinic operations.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Healthcare brings patients, doctors, and care teams into one secure
            workflow so appointments, profiles, and health management stay
            organized and accessible.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700">
              <Stethoscope size={16} />
              For Patients
            </div>

            <h3 className="mt-6 text-3xl font-bold text-slate-900">
              Find care and book with confidence.
            </h3>

            <div className="mt-8 space-y-5">
              {patientSteps.map(({ icon: Icon, title, description }, index) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-cyan-600">
                      Step {index + 1}
                    </p>
                    <h4 className="mt-1 text-xl font-semibold text-slate-900">
                      {title}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
              <BriefcaseMedical size={16} />
              For Doctors
            </div>

            <h3 className="mt-6 text-3xl font-bold text-slate-900">
              Grow your practice with one streamlined workspace.
            </h3>

            <div className="mt-8 space-y-5">
              {doctorSteps.map(({ icon: Icon, title, description }, index) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-indigo-600">
                      Step {index + 1}
                    </p>
                    <h4 className="mt-1 text-xl font-semibold text-slate-900">
                      {title}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-600">
              Platform Features
            </p>
            <h3 className="mt-4 text-4xl font-bold text-slate-900">
              Everything you need to run care smoothly.
            </h3>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                  <Icon size={20} />
                </div>
                <h4 className="mt-5 text-xl font-semibold text-slate-900">
                  {title}
                </h4>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-20 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[30px] border border-cyan-100 bg-cyan-50 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">
              For Patients
            </p>
            <h3 className="mt-4 text-3xl font-bold text-slate-900">
              Your next appointment is just a few clicks away.
            </h3>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Find the right healthcare professional and book your consultation
              without the hassle.
            </p>
            <Link
              href="/book-appointment"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 font-semibold text-white transition hover:bg-cyan-700"
            >
              Book an Appointment
              <ArrowRight size={18} />
            </Link>
          </div>

          <div
            id="contact"
            className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              For Professionals
            </p>
            <h3 className="mt-4 text-3xl font-bold text-slate-900">
              Are you a healthcare professional?
            </h3>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Join Healthcare and manage your appointments, patients, and
              professional profile from one place.
            </p>
            <Link
              href="/auth/signup"
              className="mt-7 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-5 py-3 font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              Join as a Doctor
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
