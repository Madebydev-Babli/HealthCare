"use client";

import Image from "next/image";
import { Briefcase, Star, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  doctor: any;
  onView: (doctor: any) => void;
}

export default function DoctorCard({ doctor, onView }: Props) {
  const router = useRouter();

  const handleBookNow = () => {
    router.push(`/book-appointment?doctorId=${doctor._id}`);
  };

  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      {/* Image */}
      <div className="relative h-72 overflow-hidden">
        <Image
          src={doctor.image}
          alt={doctor.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Verified Badge */}
        <div className="absolute left-4 top-4 rounded-full border border-cyan-400/20 bg-cyan-500 px-3 py-1 text-xs font-medium text-white">
          Verified
        </div>

        {/* Specialty */}
        <div className="absolute bottom-4 left-4 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md">
          {doctor.fieldOfMedical}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-slate-900">{doctor.name}</h3>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-cyan-600">
              <Briefcase size={16} />
              <span className="text-sm">Experience</span>
            </div>

            <p className="mt-1 font-bold text-slate-900">
              {doctor.experience} Years
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-cyan-600">
              <Star size={16} />
              <span className="text-sm">Consultation</span>
            </div>

            <p className="mt-1 font-bold text-slate-900">
              ₹{doctor.appointmentFee}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => onView(doctor)}
            className="flex-1 rounded-xl border border-slate-200 py-3 font-medium text-slate-900 transition hover:bg-slate-50"
          >
            View Details
          </button>

          <button
            onClick={handleBookNow}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 font-medium text-white transition hover:bg-cyan-600"
          >
            Book Now
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
