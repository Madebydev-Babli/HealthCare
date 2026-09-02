"use client";

import { useEffect, useState } from "react";

type Appointment = {
  _id: string;
  patientName: string;
  patientEmail: string;
  doctorName: string;
  date: string;
  time: string;
  fee: number;
  paymentStatus: string;
  status: string;
};

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch appointments
  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");

      const data = await res.json();

      setAppointments(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ Update Status
  const updateStatus = async (appointmentId: string, status: string) => {
    try {
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        alert("Failed to update");
        return;
      }

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === appointmentId
            ? {
                ...appointment,
                status,
              }
            : appointment,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Delete
  const deleteAppointment = async (appointmentId: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete appointment?",
    );

    if (!confirmDelete) return;

    try {
      await fetch(`/api/appointments/${appointmentId}`, {
        method: "DELETE",
      });

      setAppointments((prev) =>
        prev.filter((appointment) => appointment._id !== appointmentId),
      );
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-sm font-medium text-slate-500">
          Loading appointments...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Appointments</h1>

          <p className="mt-2 text-slate-600">Manage all clinic appointments</p>
        </div>

        <div className="rounded-2xl bg-cyan-600 px-6 py-4 text-white shadow-sm border border-cyan-700">
          <p className="text-sm font-medium">Total Appointments</p>

          <h2 className="mt-1 text-3xl font-bold">{appointments.length}</h2>
        </div>
      </div>

      {/* Empty */}
      {appointments.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm border border-slate-200">
          <h2 className="text-2xl font-semibold text-slate-700">
            No appointments found
          </h2>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                {/* Left - Patient Info */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  {/* Patient */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-600 text-2xl font-bold text-white shrink-0">
                      {appointment.patientName?.charAt(0)}
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-slate-900 truncate">
                        {appointment.patientName}
                      </h2>

                      <p className="text-sm text-slate-600 truncate">
                        {appointment.patientEmail}
                      </p>
                    </div>
                  </div>

                  {/* Doctor */}
                  <div className="rounded-lg bg-slate-50 px-4 py-3 border border-slate-200">
                    <p className="text-xs text-slate-600 uppercase tracking-wide font-medium">
                      Doctor
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      Dr. {appointment.doctorName}
                    </p>
                  </div>
                </div>

                {/* Middle - Details */}
                <div className="flex flex-wrap gap-3">
                  <div className="rounded-lg bg-slate-50 px-4 py-3 border border-slate-200">
                    <p className="text-xs text-slate-600 uppercase tracking-wide font-medium">
                      Date
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {appointment.date}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 px-4 py-3 border border-slate-200">
                    <p className="text-xs text-slate-600 uppercase tracking-wide font-medium">
                      Time
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {appointment.time}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 px-4 py-3 border border-slate-200">
                    <p className="text-xs text-slate-600 uppercase tracking-wide font-medium">
                      Fee
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      ₹{appointment.fee}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 px-4 py-3 border border-slate-200">
                    <p className="text-xs text-slate-600 uppercase tracking-wide font-medium">
                      Payment
                    </p>

                    <p
                      className={`mt-1 font-semibold capitalize ${
                        appointment.paymentStatus === "paid"
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }`}
                    >
                      {appointment.paymentStatus}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 px-4 py-3 border border-slate-200">
                    <p className="text-xs text-slate-600 uppercase tracking-wide font-medium">
                      Status
                    </p>

                    <p
                      className={`mt-1 font-semibold capitalize ${
                        appointment.status === "approved"
                          ? "text-emerald-600"
                          : appointment.status === "rejected"
                            ? "text-red-600"
                            : "text-amber-600"
                      }`}
                    >
                      {appointment.status}
                    </p>
                  </div>
                </div>

                {/* Right - Actions */}
                <div className="flex flex-wrap gap-2 lg:flex-nowrap">
                  {appointment.status === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(appointment._id, "approved")
                        }
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition flex-1 sm:flex-none"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(appointment._id, "rejected")
                        }
                        className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 transition flex-1 sm:flex-none"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {appointment.status === "approved" && (
                    <button
                      onClick={() => updateStatus(appointment._id, "rejected")}
                      className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 transition flex-1 sm:flex-none"
                    >
                      Reject
                    </button>
                  )}

                  {!["completed", "cancelled", "rejected"].includes(
                    appointment.status,
                  ) && (
                    <button
                      onClick={() => deleteAppointment(appointment._id)}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition flex-1 sm:flex-none"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
