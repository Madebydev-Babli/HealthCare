"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/dashboard/AdminSidebar";

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
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Admin Dashboard
              </h1>

              <p className="mt-2 text-gray-500">Welcome back, Admin 👋</p>
            </div>

            <div className="rounded-2xl bg-white px-6 py-4 shadow-md">
              <p className="text-sm text-gray-500">Total Platform Users</p>

              <h2 className="text-3xl font-bold text-blue-600">
                {stats.doctors + stats.patients}
              </h2>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {/* Doctors */}
            <div className="rounded-3xl bg-white p-6 shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-gray-500">Doctors</p>

                <div className="rounded-full bg-blue-100 p-3">👨‍⚕️</div>
              </div>

              <h2 className="mt-6 text-5xl font-bold text-blue-600">
                {stats.doctors}
              </h2>

              <p className="mt-2 text-sm text-gray-400">Registered Doctors</p>
            </div>

            {/* Patients */}
            <div className="rounded-3xl bg-white p-6 shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-gray-500">Patients</p>

                <div className="rounded-full bg-green-100 p-3">🧑‍🤝‍🧑</div>
              </div>

              <h2 className="mt-6 text-5xl font-bold text-green-600">
                {stats.patients}
              </h2>

              <p className="mt-2 text-sm text-gray-400">Registered Patients</p>
            </div>

            {/* Appointments */}
            <div className="rounded-3xl bg-white p-6 shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-gray-500">Appointments</p>

                <div className="rounded-full bg-purple-100 p-3">📅</div>
              </div>

              <h2 className="mt-6 text-5xl font-bold text-purple-600">
                {stats.appointments}
              </h2>

              <p className="mt-2 text-sm text-gray-400">Total Bookings</p>
            </div>

            {/* Pending */}
            <div className="rounded-3xl bg-white p-6 shadow-md">
              <div className="flex items-center justify-between">
                <p className="text-gray-500">Pending Doctors</p>

                <div className="rounded-full bg-yellow-100 p-3">⏳</div>
              </div>

              <h2 className="mt-6 text-5xl font-bold text-yellow-500">
                {stats.pendingDoctors}
              </h2>

              <p className="mt-2 text-sm text-gray-400">Awaiting Approval</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-10 rounded-3xl bg-white p-8 shadow-md">
            <h2 className="text-2xl font-bold text-gray-800">
              Platform Overview
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl bg-blue-50 p-5">
                <p className="text-sm text-gray-500">Approval Rate</p>

                <h3 className="mt-2 text-3xl font-bold text-blue-700">
                  {stats.doctors > 0
                    ? Math.round(
                        ((stats.doctors - stats.pendingDoctors) /
                          stats.doctors) *
                          100,
                      )
                    : 0}
                  %
                </h3>
              </div>

              <div className="rounded-2xl bg-green-50 p-5">
                <p className="text-sm text-gray-500">Active Patients</p>

                <h3 className="mt-2 text-3xl font-bold text-green-700">
                  {stats.patients}
                </h3>
              </div>

              <div className="rounded-2xl bg-purple-50 p-5">
                <p className="text-sm text-gray-500">Daily Appointments</p>

                <h3 className="mt-2 text-3xl font-bold text-purple-700">
                  {stats.appointments}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

