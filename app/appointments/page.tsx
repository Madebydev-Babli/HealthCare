"use client";

import { useEffect, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import AppointmentCard from "@/components/AppointmentCard";
import { Button } from "@/components/ui/button";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauth, setUnauth] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <SectionHeader title="My Appointments" subtitle="Manage your upcoming and past appointments." />

        {loading && <p className="text-center text-slate-500">Loading appointments...</p>}

        {!loading && unauth && (
          <div className="space-y-4 text-center">
            <p className="text-slate-600">Please sign in to view your appointments.</p>
            <Button onClick={() => (window.location.href = "/auth/login")}>Sign In</Button>
          </div>
        )}

        {!loading && !unauth && appointments?.length === 0 && (
          <div className="space-y-4 text-center">
            <p className="text-slate-600">No appointments yet.</p>
            <Button onClick={() => (window.location.href = "/book-appointment")}>Find a Doctor</Button>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-4">
          {appointments?.map((a) => (
            <AppointmentCard key={a._id || a.id} appointment={{ doctorName: a.doctorName || a.doctor?.name || 'Doctor', specialization: a.doctor?.fieldOfMedical || a.specialization || '', date: a.date, time: a.time, status: a.status }} />
          ))}
        </div>
      </div>
    </div>
  );
}
