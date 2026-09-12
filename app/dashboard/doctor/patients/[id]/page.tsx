"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Phone,
  UserRound,
  Droplets,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

type Patient = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  bloodGroup: string;
  address: string;
};

type Appointment = {
  _id: string;
  date: string;
  time: string;
  status: string;
};

export default function PatientDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/doctor/patients/${params.id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch patient");
        }

        setPatient(data.patient);
        setAppointments(
          Array.isArray(data.appointments) ? data.appointments : [],
        );
      } catch (error) {
        console.error("Failed to fetch patient:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPatient();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          Loading patient details...
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <UserRound className="h-8 w-8 text-slate-400" />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-slate-900">
          Patient not found
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          We couldn't find the requested patient.
        </p>

        <button
          onClick={() => router.back()}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </div>
    );
  }

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "completed",
  ).length;

  const upcomingAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "approved" || appointment.status === "pending",
  ).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-cyan-600"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Patients
      </button>

      {/* Patient Hero */}
      <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="h-28 bg-gradient-to-r from-cyan-600 via-cyan-500 to-teal-500" />

        <div className="px-6 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              {/* Avatar */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-4 border-white bg-cyan-50 text-3xl font-bold text-cyan-700 shadow-md">
                {patient.name?.charAt(0)?.toUpperCase() || "P"}
              </div>

              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {patient.name}
                  </h1>

                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                    Patient
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" />
                    {patient.email}
                  </span>

                  {patient.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4" />
                      {patient.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Total Visits</p>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  {appointments.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Overview */}
      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Personal Information */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Patient Information
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Personal and contact information
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <DetailItem
              icon={<UserRound />}
              label="Full Name"
              value={patient.name}
            />

            <DetailItem
              icon={<Mail />}
              label="Email Address"
              value={patient.email}
            />

            <DetailItem
              icon={<Phone />}
              label="Phone Number"
              value={patient.phone}
            />

            <DetailItem
              icon={<UserRound />}
              label="Gender"
              value={patient.gender}
            />

            <DetailItem
              icon={<Droplets />}
              label="Blood Group"
              value={patient.bloodGroup}
            />

            <DetailItem
              icon={<MapPin />}
              label="Address"
              value={patient.address}
              fullWidth
            />
          </div>
        </div>

        {/* Appointment Summary */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Appointment Summary
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Overview of this patient's visits
            </p>
          </div>

          <div className="space-y-4">
            <SummaryCard
              icon={<CalendarDays />}
              label="Total Appointments"
              value={appointments.length}
            />

            <SummaryCard
              icon={<Activity />}
              label="Completed Visits"
              value={completedAppointments}
            />

            <SummaryCard
              icon={<Clock3 />}
              label="Upcoming"
              value={upcomingAppointments}
            />
          </div>
        </div>
      </section>

      {/* Appointment History */}
      <section className="rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Appointment History
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Complete appointment history for {patient.name}
              </p>
            </div>

            <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              {appointments.length}{" "}
              {appointments.length === 1 ? "Appointment" : "Appointments"}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {appointments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                <CalendarDays className="h-6 w-6 text-slate-400" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No appointments yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Appointment history will appear here once this patient books a
                visit.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <AppointmentRow
                  key={appointment._id}
                  appointment={appointment}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* -------------------------------- */
/* Detail Item */
/* -------------------------------- */

function DetailItem({
  icon,
  label,
  value,
  fullWidth = false,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-100 bg-slate-50/70 p-4 ${
        fullWidth ? "sm:col-span-2" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-600 shadow-sm">
          <div className="[&>svg]:h-4 [&>svg]:w-4">{icon}</div>
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-semibold text-slate-800">
            {value || "Not provided"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* Summary Card */
/* -------------------------------- */

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
          <div className="[&>svg]:h-5 [&>svg]:w-5">{icon}</div>
        </div>

        <span className="text-sm font-medium text-slate-600">{label}</span>
      </div>

      <span className="text-xl font-bold text-slate-900">{value}</span>
    </div>
  );
}

/* -------------------------------- */
/* Appointment Row */
/* -------------------------------- */

function AppointmentRow({ appointment }: { appointment: Appointment }) {
  const status = appointment.status?.toLowerCase();

  const statusConfig = {
    approved: {
      label: "Approved",
      className: "bg-cyan-50 text-cyan-700",
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    completed: {
      label: "Completed",
      className: "bg-slate-100 text-slate-700",
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    pending: {
      label: "Pending",
      className: "bg-amber-50 text-amber-700",
      icon: <Clock className="h-4 w-4" />,
    },
    rejected: {
      label: "Rejected",
      className: "bg-slate-100 text-slate-600",
      icon: <XCircle className="h-4 w-4" />,
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-slate-100 text-slate-600",
      icon: <XCircle className="h-4 w-4" />,
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: appointment.status || "Unknown",
    className: "bg-slate-100 text-slate-600",
    icon: <Clock className="h-4 w-4" />,
  };

  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition-all duration-200 hover:border-cyan-100 hover:bg-cyan-50/20 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
          <CalendarDays className="h-5 w-5" />
        </div>

        <div>
          <p className="font-semibold text-slate-900">{appointment.date}</p>

          <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            <Clock3 className="h-3.5 w-3.5" />
            {appointment.time}
          </div>
        </div>
      </div>

      <span
        className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${config.className}`}
      >
        {config.icon}
        {config.label}
      </span>
    </div>
  );
}
