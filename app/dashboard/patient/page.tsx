import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowRight, CalendarDays, Clock3, Stethoscope, Users } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Appointment from "@/lib/models/appointment";
import Patient from "@/lib/models/patient";

const parseAppointmentDate = (date: string, time: string) => {
  const timeMatch = time.match(/(\d{1,2}):(\d{2})\s*([AP]M)?/i);
  let hours = 0;
  let minutes = 0;

  if (timeMatch) {
    hours = Number(timeMatch[1]);
    minutes = Number(timeMatch[2]);
    const period = timeMatch[3]?.toUpperCase();

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
  }

  const isoMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return new Date(Number(y), Number(m) - 1, Number(d), hours, minutes);
  }

  return new Date(`${date} ${time}`);
};

export default async function PatientDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  await connectDB();

  const patient = await Patient.findOne({
    userId: session.user.id,
  }).lean();

  if (!patient) {
    redirect("/dashboard/patient/profile");
  }

  const appointments = await Appointment.find({
    patientId: session.user.id,
  })
    .sort({ createdAt: -1 })
    .lean();

  const upcomingAppointments = appointments
    .filter((appointment: any) => !["completed", "rejected", "cancelled"].includes(appointment.status))
    .sort((a: any, b: any) => {
      const aDate = parseAppointmentDate(a.date, a.time).getTime();
      const bDate = parseAppointmentDate(b.date, b.time).getTime();
      return aDate - bDate;
    });

  const nextAppointment = upcomingAppointments[0] || null;
  const recentAppointments = appointments.slice(0, 4);

  const stats = {
    total: appointments.length,
    upcoming: upcomingAppointments.length,
    pending: appointments.filter((appointment: any) => appointment.status === "pending").length,
    completed: appointments.filter((appointment: any) => appointment.status === "completed").length,
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <header className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">Patient Dashboard</p>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Good morning, {patient.name?.split(" ")[0] || "Patient"} 👋
            </h1>
            <p className="mt-2 text-base text-slate-600">
              Here&apos;s your healthcare overview.
            </p>
          </div>

          <Link
            href="/book-appointment"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            Book an Appointment
            <ArrowRight size={18} />
          </Link>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Upcoming Appointments" value={String(stats.upcoming)} icon={CalendarDays} accent="cyan" />
        <DashboardCard title="Pending Appointments" value={String(stats.pending)} icon={Clock3} accent="amber" />
        <DashboardCard title="Completed Appointments" value={String(stats.completed)} icon={Users} accent="emerald" />
        <DashboardCard title="Total Appointments" value={String(stats.total)} icon={Stethoscope} accent="violet" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-slate-900">Upcoming Appointment</h2>
            {nextAppointment && (
              <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                {nextAppointment.status}
              </span>
            )}
          </div>

          {nextAppointment ? (
            <div className="mt-6 flex flex-col gap-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5 md:flex-row md:items-center">
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <img
                  src={nextAppointment.doctorId?.image || "/clinic.jpg"}
                  alt={nextAppointment.doctorName || "Doctor"}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1">
                <p className="text-xl font-bold text-slate-900">{nextAppointment.doctorName || "Doctor"}</p>
                <p className="mt-1 text-sm text-cyan-700">{nextAppointment.doctorId?.fieldOfMedical || "General Care"}</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Date</p>
                    <p className="mt-1 font-medium text-slate-900">{nextAppointment.date}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Time</p>
                    <p className="mt-1 font-medium text-slate-900">{nextAppointment.time}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start gap-3 md:items-end">
                <div className="rounded-2xl bg-white px-4 py-3 text-sm shadow-sm">
                  <p className="text-slate-500">Consultation fee</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">₹{nextAppointment.fee || 0}</p>
                </div>

                <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                  View Details
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-2xl font-semibold text-slate-800">No upcoming appointments</p>
              <p className="mt-2 text-slate-600">Book an appointment with a verified doctor.</p>
              <Link
                href="/doctors"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                Find a Doctor
                <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
          <div className="mt-6 space-y-3">
            <QuickAction href="/book-appointment" label="Book Appointment" />
            <QuickAction href="/doctors" label="Find Doctor" />
            <QuickAction href="/appointments" label="View Appointments" />
            <QuickAction href="/dashboard/patient/profile" label="Edit Profile" />
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-slate-900">Recent Appointments</h2>
          <Link href="/appointments" className="text-sm font-semibold text-cyan-700 hover:text-cyan-600">
            View all
          </Link>
        </div>

        <div className="mt-6 space-y-4">
          {recentAppointments.length > 0 ? (
            recentAppointments.map((appointment: any) => (
              <div
                key={String(appointment._id)}
                className="flex flex-col gap-4 rounded-[22px] border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                    <Stethoscope size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{appointment.doctorName || "Doctor"}</p>
                    <p className="text-sm text-slate-500">{appointment.doctorId?.fieldOfMedical || "General Care"}</p>
                  </div>
                </div>

                <div className="grid gap-1 text-sm text-slate-600 sm:grid-cols-2 md:min-w-[220px]">
                  <span>{appointment.date}</span>
                  <span>{appointment.time}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium capitalize text-slate-700">
                    {appointment.status}
                  </span>
                  <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="text-slate-600">No appointments yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
  icon: any;
  accent: "cyan" | "amber" | "emerald" | "violet";
}) {
  const palette = {
    cyan: "bg-cyan-100 text-cyan-700",
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
    violet: "bg-violet-100 text-violet-700",
  };

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${palette[accent]}`}>
          <Icon size={20} />
        </div>
      </div>

      <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900">{value}</h2>
    </div>
  );
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
    >
      {label}
      <ArrowRight size={16} />
    </Link>
  );
}
