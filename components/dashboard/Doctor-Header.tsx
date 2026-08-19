"use client";

import Image from "next/image";
import { CalendarDays, ArrowRight } from "lucide-react";
import { Doctor } from "@/types/doctor-dashboard";

type Props = {
  doctor: Doctor;
};

export default function DashboardHeader({ doctor }: Props) {
  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="overflow-hidden rounded-3xl bg-cyan-500 p-8 text-white shadow-xl">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-start lg:gap-36">
        {/* Left Section */}
        <div className="flex items-center gap-5">
          <div className="relative h-20 w-20 overflow-hidden rounded-2xl border-4 border-white/20 bg-white">
            <Image
              src={doctor.image || "/doctor-placeholder.png"}
              alt={doctor.name}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {greeting},<br /> Dr. {doctor.name}
            </h1>

            <p className="mt-2 text-blue-100">
              Welcome back! Have a productive day.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-start gap-5 lg:items-end">
          <div className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 backdrop-blur-md">
            <CalendarDays className="h-5 w-5" />

            <span className="font-medium">{today}</span>
          </div>

          <button className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-blue-600 transition hover:scale-105 hover:bg-blue-50">
            View Profile
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
