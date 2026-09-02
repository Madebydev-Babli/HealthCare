"use client";

import { useEffect, useState } from "react";

type Stats = {
  doctors: number;
  patients: number;
  appointments: number;
  pendingDoctors: number;
};

export default function AdminHomePage() {
  const [stats, setStats] = useState<Stats>({
    doctors: 0,
    patients: 0,
    appointments: 0,
    pendingDoctors: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");

        const data = await res.json();

        setStats(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm font-medium text-slate-500">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Admin Dashboard</h1>

          <p className="mt-2 text-slate-600">Welcome back, Admin 👋</p>
        </div>

        <div className="rounded-2xl bg-white px-6 py-4 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-600">Total Platform Users</p>

          <h2 className="mt-2 text-3xl font-bold text-cyan-600">
            {stats.doctors + stats.patients}
          </h2>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Doctors */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Doctors</p>
              <h3 className="mt-4 text-4xl font-bold text-cyan-600">
                {stats.doctors}
              </h3>
              <p className="mt-2 text-sm text-slate-500">Registered Doctors</p>
            </div>
            <div className="rounded-lg bg-cyan-100 p-3 text-cyan-600">👨‍⚕️</div>
          </div>
        </div>

        {/* Patients */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Patients</p>
              <h3 className="mt-4 text-4xl font-bold text-cyan-600">
                {stats.patients}
              </h3>
              <p className="mt-2 text-sm text-slate-500">Registered Patients</p>
            </div>
            <div className="rounded-lg bg-cyan-100 p-3">🧑‍🤝‍🧑</div>
          </div>
        </div>

        {/* Appointments */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Appointments</p>
              <h3 className="mt-4 text-4xl font-bold text-cyan-600">
                {stats.appointments}
              </h3>
              <p className="mt-2 text-sm text-slate-500">Total Bookings</p>
            </div>
            <div className="rounded-lg bg-cyan-100 p-3">📅</div>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                Pending Doctors
              </p>
              <h3 className="mt-4 text-4xl font-bold text-cyan-600">
                {stats.pendingDoctors}
              </h3>
              <p className="mt-2 text-sm text-slate-500">Awaiting Approval</p>
            </div>
            <div className="rounded-lg bg-cyan-100 p-3">⏳</div>
          </div>
        </div>
      </div>

      {/* Platform Overview */}
      <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900">Platform Overview</h2>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <div className="rounded-xl bg-cyan-50 p-5 border border-cyan-100">
            <p className="text-sm font-medium text-slate-600">Approval Rate</p>

            <h3 className="mt-3 text-3xl font-bold text-cyan-700">
              {stats.doctors > 0
                ? Math.round(
                    ((stats.doctors - stats.pendingDoctors) / stats.doctors) *
                      100,
                  )
                : 0}
              %
            </h3>
          </div>

          <div className="rounded-xl bg-cyan-50 p-5 border border-cyan-100">
            <p className="text-sm font-medium text-slate-600">
              Active Patients
            </p>

            <h3 className="mt-3 text-3xl font-bold text-cyan-700">
              {stats.patients}
            </h3>
          </div>

          <div className="rounded-xl bg-cyan-50 p-5 border border-cyan-100">
            <p className="text-sm font-medium text-slate-600">
              Total Appointments
            </p>

            <h3 className="mt-3 text-3xl font-bold text-cyan-700">
              {stats.appointments}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
