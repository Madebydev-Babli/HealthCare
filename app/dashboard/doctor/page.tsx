"use client";

import AppointmentOverview from "@/components/dashboard/doctor/AppointmentOverview";
import DoctorProfileSetup from "@/components/dashboard/doctor/DoctorProfileSetup";
import DoctorUnderReview from "@/components/dashboard/doctor/DoctorUnderReview";
import RecentPatients from "@/components/dashboard/doctor/RecentPatients";
import StatsCards from "@/components/dashboard/doctor/StatsCard";
import TodayAppointments from "@/components/dashboard/doctor/Today'sAppointment";
import DashboardHeader from "@/components/dashboard/Doctor-Header";
import type {
  DoctorDashboardData,
  DoctorDashboardResponse,
} from "@/types/doctor-dashboard";
import { useEffect, useState } from "react";
import { CalendarDays, Users, IndianRupee, Star } from "lucide-react";

export default function DoctorDashboard() {
  const [data, setData] = useState<DoctorDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/doctor/dashboard");

        if (!res.ok) {
          throw new Error("Failed to fetch dashboard");
        }

        const dashboardData = await res.json();

        setData(dashboardData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  /* --------------------------------
     Loading
  -------------------------------- */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-sm font-medium text-slate-500">
          Loading dashboard...
        </div>
      </div>
    );
  }

  /* --------------------------------
     Error
  -------------------------------- */

  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">
            Unable to load dashboard
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Please refresh the page and try again.
          </p>
        </div>
      </div>
    );
  }

  if (data.onboarding) {
    if (data.status === "approved" && data.profileCompleted === false) {
      return <DoctorProfileSetup />;
    }

    return <DoctorUnderReview />;
  }

  return (
    <div className="w-full min-w-0">
      <div className="w-full min-w-0">
        {/* =====================================
            HEADER
        ===================================== */}

        <DashboardHeader doctor={data.doctor} />

        {/* =====================================
            MAIN STATISTICS
        ===================================== */}

        <section className="mt-6">
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCards
              title="Appointments"
              value={data.stats.totalAppointments}
              icon={CalendarDays}
              color="text-blue-600"
              bg="bg-blue-100"
              change="+12% this month"
            />

            <StatsCards
              title="Patients"
              value={data.stats.totalPatients}
              icon={Users}
              color="text-green-600"
              bg="bg-green-100"
              change="+5 new"
            />

            <StatsCards
              title="Revenue"
              value={`₹${data.stats.totalEarnings}`}
              icon={IndianRupee}
              color="text-violet-600"
              bg="bg-violet-100"
            />

            <StatsCards
              title="Rating"
              value="4.9"
              icon={Star}
              color="text-yellow-500"
              bg="bg-yellow-100"
            />
          </div>
        </section>

        {/* =====================================
            ANALYTICS
        ===================================== */}

        <section className="mt-6">
          <div
            className="
              grid
              w-full
              min-w-0
              grid-cols-1
              gap-6
              lg:grid-cols-5
            "
          >
            {/* Appointment Overview */}

            <div className="min-w-0 lg:col-span-2">
              <AppointmentOverview data={data.appointmentOverview} />
            </div>

            {/* Today's Appointments */}

            <div className="min-w-0 lg:col-span-3">
              <TodayAppointments appointments={data.todayAppointments} />
            </div>
          </div>
        </section>

        {/* =====================================
            RECENT PATIENTS
        ===================================== */}

        <section className="mt-6">
          <div className="w-full min-w-0">
            <RecentPatients patients={data.recentPatients} />
          </div>
        </section>
      </div>
    </div>
  );
}
