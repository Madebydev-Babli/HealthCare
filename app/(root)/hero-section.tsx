"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Calendar, Users, Stethoscope, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const [stats, setStats] = useState<{
    doctors?: number;
    patients?: number;
    appointments?: number;
  } | null>(null);

  const { data: session, status: authStatus } = useSession();

  const [apptLoading, setApptLoading] = useState(false);
  const [upcoming, setUpcoming] = useState<any | null>(null);
  const [apptError, setApptError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) return;
        const data = await res.json();
        if (mounted)
          setStats({
            doctors: data.doctors,
            patients: data.patients,
            appointments: data.appointments,
          });
      } catch (err) {
        // ignore
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Helper: parse appointment date+time to JS Date
  const parseApptDate = (dateStr: string, timeStr: string) => {
    try {
      let hours = 0;
      let minutes = 0;

      const time = (timeStr || "").trim();

      const ampm = /([APap][Mm])$/;
      const ampmMatch = time.match(ampm);

      const hmMatch = time.match(/(\d{1,2}):(\d{2})/);

      if (hmMatch) {
        hours = parseInt(hmMatch[1], 10);
        minutes = parseInt(hmMatch[2], 10);

        if (ampmMatch) {
          const marker = ampmMatch[1].toLowerCase();
          if (marker === "pm" && hours !== 12) hours += 12;
          if (marker === "am" && hours === 12) hours = 0;
        }
      }

      // assume dateStr is ISO YYYY-MM-DD when possible
      const isoMatch = dateStr && dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (isoMatch) {
        const y = parseInt(isoMatch[1], 10);
        const m = parseInt(isoMatch[2], 10);
        const d = parseInt(isoMatch[3], 10);
        return new Date(y, m - 1, d, hours, minutes);
      }

      // fallback: let Date parse combined string
      const combined = `${dateStr} ${time}`;
      const dt = new Date(combined);
      if (!isNaN(dt.getTime())) return dt;

      return new Date(dateStr);
    } catch (e) {
      return new Date();
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadAppointments = async () => {
      if (authStatus !== "authenticated") return;

      setApptLoading(true);
      setApptError(null);

      try {
        const res = await fetch("/api/appointments");

        if (res.status === 401) {
          // treat as unauthenticated
          setUpcoming(null);
          return;
        }

        const data = await res.json();
        const appts = Array.isArray(data) ? data : data.appointments || [];

        const now = new Date();

        const valid = appts
          .filter((a: any) => {
            // Exclude completed/rejected/cancelled and any explicitly past items
            const badStatuses = ["completed", "rejected", "cancelled"];
            if (a.status && badStatuses.includes(a.status)) return false;

            const dt = parseApptDate(a.date, a.time);
            return dt.getTime() >= now.getTime();
          })
          .map((a: any) => ({
            ...a,
            __dt: parseApptDate(a.date, a.time),
          }))
          .sort((x: any, y: any) => x.__dt.getTime() - y.__dt.getTime());

        if (mounted) {
          setUpcoming(valid.length > 0 ? valid[0] : null);
        }
      } catch (err: any) {
        console.error(err);
        if (mounted) setApptError("Failed to load appointments");
      } finally {
        if (mounted) setApptLoading(false);
      }
    };

    loadAppointments();

    return () => {
      mounted = false;
    };
  }, [authStatus]);
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/clinic.jpg"
          alt="Clinic"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="flex min-h-screen items-center">
          <div className="max-w-3xl text-white">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md"
            >
              Modern Healthcare Management
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-5xl font-bold leading-tight md:text-7xl"
            >
              Healthcare,
              <br />
              <span className="text-cyan-400">Simplified.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 max-w-xl text-lg text-gray-200"
            >
              Book appointments, connect with verified doctors, manage your
              healthcare journey, and simplify clinic operations — all from one
              secure platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                href="/book-appointment"
                className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-4 font-semibold text-white transition hover:bg-cyan-600"
              >
                Book an Appointment
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/doctors"
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-4 font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
              >
                Find a Doctor
              </Link>
            </motion.div>

            {/* Stats */}
            <div className="mt-12 flex flex-wrap gap-8">
              <div>
                <h3 className="text-3xl font-bold">{stats?.patients ?? "—"}</h3>
                <p className="text-gray-300">Patients</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">{stats?.doctors ?? "—"}</h3>
                <p className="text-gray-300">Doctors</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold">
                  {stats?.appointments ?? "—"}
                </h3>
                <p className="text-gray-300">Appointments</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Card - show only to authenticated users */}
      {authStatus === "authenticated" && (
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="absolute bottom-16 right-10 hidden w-96 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl lg:block"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/20 p-3">
              <Calendar className="text-cyan-400" />
            </div>

            <div>
              <h3 className="font-semibold text-white">Upcoming Appointment</h3>
              <p className="text-sm text-gray-300">
                Stay updated with your schedule
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {apptLoading ? (
              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-white font-medium">
                  Loading upcoming appointment...
                </p>
              </div>
            ) : apptError ? (
              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-white font-medium">
                  Unable to load appointments
                </p>
                <p className="text-sm text-gray-300">Please try again later.</p>
              </div>
            ) : upcoming ? (
              <div className="rounded-xl bg-white/10 p-4">
                {session?.user?.role === "doctor" ? (
                  <>
                    <p className="text-white font-medium">
                      {upcoming.patientName}
                    </p>
                    <p className="text-sm text-gray-300">
                      {upcoming.__dt instanceof Date
                        ? upcoming.__dt.toLocaleDateString()
                        : upcoming.date}{" "}
                      •{" "}
                      {upcoming.__dt instanceof Date
                        ? upcoming.__dt.toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : upcoming.time}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-white font-medium">
                      Dr. {upcoming.doctorName}
                    </p>
                    <p className="text-sm text-gray-300">
                      {upcoming.specialization ||
                      upcoming.doctor?.fieldOfMedical
                        ? `${upcoming.specialization || upcoming.doctor?.fieldOfMedical} • `
                        : ""}
                      {upcoming.__dt instanceof Date
                        ? upcoming.__dt.toLocaleDateString()
                        : upcoming.date}{" "}
                      •{" "}
                      {upcoming.__dt instanceof Date
                        ? upcoming.__dt.toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : upcoming.time}
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-white font-medium">
                  No upcoming appointments
                </p>
                <p className="text-sm text-gray-300">
                  You have no scheduled appointments.
                </p>

                <div className="mt-3">
                  {session?.user?.role === "doctor" ? (
                    <Link
                      href="/dashboard/doctor"
                      className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white"
                    >
                      View Schedule
                    </Link>
                  ) : (
                    <Link
                      href="/book-appointment"
                      className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Book an Appointment
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </section>
  );
}
