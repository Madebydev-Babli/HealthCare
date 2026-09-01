"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Filter,
  Search,
  Stethoscope,
} from "lucide-react";

import { StatusBadge } from "@/components/ui/StatusBadge";

const tabs = ["all", "upcoming", "pending", "completed", "cancelled"] as const;

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauth, setUnauth] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("/api/appointments");
        if (res.status === 401) {
          setAppointments([]);
          setUnauth(true);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setAppointments(Array.isArray(data) ? data : data.appointments || []);
      } catch (err) {
        console.error(err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const parseDateTime = (date: string, time: string) => {
    const timeValue = time.match(/(\d{1,2}):(\d{2})\s*([AP]M)?/i);
    let hours = 0;
    let minutes = 0;

    if (timeValue) {
      hours = Number(timeValue[1]);
      minutes = Number(timeValue[2]);
      const period = timeValue[3]?.toUpperCase();
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
    }

    const iso = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) {
      const [, y, m, d] = iso;
      return new Date(
        Number(y),
        Number(m) - 1,
        Number(d),
        hours,
        minutes,
      ).getTime();
    }

    return new Date(`${date} ${time}`).getTime();
  };

  const filteredAppointments = useMemo(() => {
    const list = appointments || [];

    const normalized = list.filter((appointment) => {
      const doctorName = (appointment.doctorName || "Doctor").toLowerCase();
      const status = (appointment.status || "").toLowerCase();
      const matchesSearch =
        !search || doctorName.includes(search.toLowerCase());

      const dateValue = parseDateTime(appointment.date, appointment.time);
      const future = !["completed", "rejected", "cancelled"].includes(status);
      const isUpcoming = future && dateValue >= Date.now();

      if (activeTab === "upcoming") return matchesSearch && isUpcoming;
      if (activeTab === "pending") return matchesSearch && status === "pending";
      if (activeTab === "completed")
        return matchesSearch && status === "completed";
      if (activeTab === "cancelled")
        return matchesSearch && status === "cancelled";
      return matchesSearch;
    });

    return [...normalized].sort(
      (a, b) => parseDateTime(a.date, a.time) - parseDateTime(b.date, b.time),
    );
  }, [activeTab, appointments, search]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600">
                Appointments
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                My Appointments
              </h1>
            </div>

            <Link
              href="/book-appointment"
              className="inline-flex items-center justify-center rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
            >
              Book Appointment
            </Link>
          </div>

          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by doctor"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-3.5 py-2 text-sm font-medium capitalize transition ${
                    activeTab === tab
                      ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && (
          <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Loading your appointments...
          </div>
        )}

        {!loading && unauth && (
          <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-xl font-semibold text-slate-900">
              Please sign in to view your appointments.
            </p>
            <Link
              href="/auth/login"
              className="mt-5 inline-flex items-center rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
            >
              Sign In
            </Link>
          </div>
        )}

        {!loading && !unauth && filteredAppointments.length === 0 && (
          <div className="mt-8 rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 text-cyan-700">
              <CalendarDays size={28} />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-slate-900">
              No appointments found
            </h2>
            <p className="mt-2 text-slate-600">
              Your selected filter is empty right now.
            </p>
            <Link
              href="/book-appointment"
              className="mt-6 inline-flex items-center rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
            >
              Find a Doctor
            </Link>
          </div>
        )}

        {!loading && !unauth && filteredAppointments.length > 0 && (
          <div className="mt-8 space-y-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={String(appointment._id)}
                className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                      <Stethoscope size={22} />
                    </div>

                    <div>
                      <p className="text-xl font-bold text-slate-900">
                        {appointment.doctorName || "Doctor"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {appointment.doctorId?.fieldOfMedical ||
                          appointment.specialization ||
                          "Healthcare consultation"}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={15} /> {appointment.date}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 size={15} /> {appointment.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                    <div className="rounded-2xl bg-slate-50 px-4 py-2 text-left text-sm">
                      <p className="text-slate-500">Fee</p>
                      <p className="font-semibold text-slate-900">
                        ₹{appointment.fee || 0}
                      </p>
                    </div>

                    <StatusBadge status={appointment.status || "pending"} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
