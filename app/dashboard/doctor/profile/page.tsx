"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Edit3,
  MapPin,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Doctor = {
  name?: string;
  image?: string;
  gender?: string;
  dob?: string;
  phone?: string;
  specialization?: string;
  degree?: string;
  experience?: number;
  licenseNumber?: string;
  languages?: string[];
  consultationFee?: number;
  consultationMode?: string;
  bio?: string;
  rating?: number;
  verified?: boolean;
  clinic?: {
    name?: string;
    images?: string[];
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    landmark?: string;
    phone?: string;
    mapLink?: string;
  };
  availability?: Record<
    string,
    { available?: boolean; start?: string; end?: string }
  >;
};
const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
const display = (value?: string | number) =>
  value === undefined || value === "" ? "Not provided" : String(value);

export default function DoctorProfilePage() {
  const router = useRouter();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/doctor/profile")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Unable to load profile");
        setDoctor(data.doctor);
      })
      .catch((reason) =>
        setError(
          reason instanceof Error ? reason.message : "Unable to load profile",
        ),
      )
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <div className="mx-auto max-w-5xl animate-pulse p-6">
        <div className="h-48 rounded-2xl bg-slate-200" />
        <div className="mt-6 h-72 rounded-2xl bg-slate-200" />
      </div>
    );
  if (error || !doctor)
    return (
      <div className="mx-auto max-w-xl p-6">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
          <h1 className="text-xl font-bold text-red-900">
            Unable to load profile
          </h1>
          <p className="mt-2 text-sm text-red-700">
            {error || "Your profile is not available yet."}
          </p>
          <button
            onClick={() => router.push("/dashboard/doctor")}
            className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <button
        onClick={() => router.push("/dashboard/doctor")}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950"
      >
        <ArrowLeft size={16} /> Dashboard
      </button>
      <header className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cyan-50 text-3xl font-bold text-cyan-700">
            {doctor.image ? (
              <img
                src={doctor.image}
                alt={doctor.name || "Doctor"}
                className="h-full w-full object-cover"
              />
            ) : (
              (doctor.name || "D").charAt(0)
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-950">
              Dr. {display(doctor.name)}
            </h1>
            <p className="mt-1 text-cyan-700">
              {display(doctor.specialization)}
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 size={15} className="text-emerald-600" />{" "}
                {doctor.verified ? "Verified" : "Approved"}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock3 size={15} /> {display(doctor.experience)} years
              </span>
              <span className="inline-flex items-center gap-1">
                <Star size={15} className="text-amber-500" />{" "}
                {display(doctor.rating || 0)}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => router.push("/dashboard/doctor/profile/edit")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-800"
        >
          <Edit3 size={16} /> Edit profile
        </button>
      </header>
      <InfoSection title="Personal information">
        <Info label="Name" value={doctor.name} />
        <Info label="Gender" value={doctor.gender} />
        <Info
          label="Date of birth"
          value={
            doctor.dob
              ? new Date(doctor.dob).toLocaleDateString("en-IN")
              : undefined
          }
        />
        <Info label="Phone" value={doctor.phone} />
      </InfoSection>
      <InfoSection title="Professional information">
        <Info label="Specialization" value={doctor.specialization} />
        <Info label="Degree" value={doctor.degree} />
        <Info
          label="Experience"
          value={
            doctor.experience !== undefined
              ? `${doctor.experience} years`
              : undefined
          }
        />
        <Info label="License number" value={doctor.licenseNumber} />
        <Info label="Languages" value={doctor.languages?.join(", ")} />
        <Info
          label="Consultation fee"
          value={
            doctor.consultationFee !== undefined
              ? `₹${doctor.consultationFee}`
              : undefined
          }
        />
        <Info label="Mode" value={doctor.consultationMode} />
        <div className="sm:col-span-2">
          <Info label="Bio" value={doctor.bio} />
        </div>
      </InfoSection>
      <InfoSection title="Clinic">
        <Info label="Clinic name" value={doctor.clinic?.name} />
        <Info
          label="Address"
          value={[
            doctor.clinic?.address,
            doctor.clinic?.city,
            doctor.clinic?.state,
            doctor.clinic?.pincode,
          ]
            .filter(Boolean)
            .join(", ")}
        />
        <Info label="Landmark" value={doctor.clinic?.landmark} />
        <Info label="Phone" value={doctor.clinic?.phone} />
        {doctor.clinic?.mapLink && (
          <a
            href={doctor.clinic.mapLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm font-semibold text-cyan-700"
          >
            <MapPin size={16} /> Open map
          </a>
        )}
        {doctor.clinic?.images?.length ? (
          <div className="mt-2 flex flex-wrap gap-3 sm:col-span-2">
            {doctor.clinic.images.map((image) => (
              <img
                key={image}
                src={image}
                alt="Clinic"
                className="h-28 w-40 rounded-lg object-cover"
              />
            ))}
          </div>
        ) : null}
      </InfoSection>
      <InfoSection title="Weekly availability">
        <div className="grid gap-2 sm:grid-cols-2">
          {days.map((day) => {
            const entry = doctor.availability?.[day];
            return (
              <div
                key={day}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 text-sm"
              >
                <span className="font-medium">
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </span>
                <span className="text-slate-600">
                  {entry?.available && entry.start && entry.end
                    ? `${entry.start} - ${entry.end}`
                    : "Day off"}
                </span>
              </div>
            );
          })}
        </div>
      </InfoSection>
    </div>
  );
}
function InfoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-5 text-lg font-bold text-slate-900">{title}</h2>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}
function Info({ label, value }: { label: string; value?: string | number }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">
        {display(value)}
      </p>
    </div>
  );
}
