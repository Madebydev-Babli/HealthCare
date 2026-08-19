"use client";

import Image from "next/image";
import {
  BadgeCheck,
  Briefcase,
  GraduationCap,
  IndianRupee,
  Calendar,
} from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function DoctorModal({ doctor, open, onOpenChange }: any) {
  if (!doctor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          !w-[92vw]
          !max-w-[1200px]
          overflow-hidden
          border-0
          p-0
          rounded-[32px]
        "
      >
        <div className="bg-white">
          {/* Cover */}
          <div className="h-36 bg-gradient-to-r from-cyan-600 via-cyan-500 to-sky-500" />

          {/* Profile Header */}
          <div className="px-8 pb-8">
            <div className="-mt-20 flex flex-col gap-6 lg:flex-row lg:items-center">
              {/* Doctor Image */}
              <div className="relative h-44 w-44 overflow-hidden rounded-[28px] border-4 border-white bg-white shadow-xl">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-2 text-sm font-medium text-cyan-700">
                  <BadgeCheck size={16} />
                  Verified Specialist
                </div>

                <h2 className="mt-4 text-4xl font-bold text-slate-900">
                  {doctor.name}
                </h2>

                <p className="mt-2 text-lg font-medium text-cyan-600">
                  {doctor.fieldOfMedical}
                </p>
              </div>

              {/* Fee Card */}
              <div className="rounded-3xl border border-cyan-100 bg-cyan-50 px-8 py-6 text-center">
                <p className="text-sm text-slate-500">Consultation Fee</p>

                <h3 className="mt-2 text-4xl font-bold text-cyan-600">
                  ₹{doctor.appointmentFee}
                </h3>
              </div>
            </div>

            {/* Quick Info */}
            <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 p-4">
                <GraduationCap size={20} className="mb-2 text-cyan-500" />

                <p className="text-sm text-slate-500">Qualification</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {doctor.degree}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <Briefcase size={20} className="mb-2 text-cyan-500" />

                <p className="text-sm text-slate-500">Experience</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {doctor.experience} Years
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <IndianRupee size={20} className="mb-2 text-cyan-500" />

                <p className="text-sm text-slate-500">Appointment Fee</p>

                <p className="mt-1 font-semibold text-slate-900">
                  ₹{doctor.appointmentFee}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <BadgeCheck size={20} className="mb-2 text-cyan-500" />

                <p className="text-sm text-slate-500">License Number</p>

                <p className="mt-1 break-all font-semibold text-slate-900">
                  {doctor.licenseNumber}
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="mt-6 grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
              {/* About */}
              <div className="rounded-3xl border border-slate-200 p-6">
                <h3 className="text-2xl font-bold text-slate-900">
                  About Doctor
                </h3>

                <p className="mt-4 leading-8 text-slate-600">
                  Dr. {doctor.name} is an experienced{" "}
                  {doctor.fieldOfMedical.toLowerCase()} specialist with{" "}
                  {doctor.experience} years of professional experience.
                  Dedicated to providing patient-centered healthcare services
                  using modern medical practices and evidence-based treatment
                  approaches.
                </p>
              </div>

              {/* Appointment Details */}
              <div className="rounded-3xl border border-cyan-100 bg-cyan-50/50 p-6">
                <div className="flex items-center gap-3">
                  <Calendar className="text-cyan-600" />

                  <h3 className="text-xl font-bold text-slate-900">
                    Appointment
                  </h3>
                </div>

                <p className="mt-4 leading-8 text-slate-600">
                  {doctor.appointmentDetails}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => onOpenChange(false)}
                className="flex-1 rounded-2xl border border-slate-200 py-4 font-medium transition hover:bg-slate-50"
              >
                Close
              </button>

              <button className="flex-1 rounded-2xl bg-cyan-500 py-4 font-semibold text-white transition hover:bg-cyan-600">
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
