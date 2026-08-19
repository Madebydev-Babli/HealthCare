"use client";

import Image from "next/image";
import { Doctor } from "@/types/doctor-dashboard";

type Props = {
  doctor: Doctor;
};

export default function DashboardHeader({ doctor }: Props) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <div className="relative h-20 w-20 overflow-hidden rounded-2xl">
            <Image
              src={doctor.image || "/doctor-placeholder.png"}
              alt={doctor.name}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Dr. {doctor.name}
              </h1>

              {doctor.verified && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  Verified
                </span>
              )}
            </div>

            <p className="mt-1 text-gray-500">{doctor.specialization}</p>

            <p className="mt-2 text-sm text-gray-400">
              {doctor.degree} • {doctor.experience} years experience
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-sm text-gray-500">Today's Overview</p>

          <p className="mt-1 text-lg font-semibold text-gray-900">
            Welcome back, Doctor 👋
          </p>
        </div>
      </div>
    </div>
  );
}
