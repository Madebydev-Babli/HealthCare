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
      <div className="p-8 text-lg font-semibold">Loading appointments...</div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Appointments</h1>

            <p className="mt-2 text-gray-500">Manage all clinic appointments</p>
          </div>

          <div className="rounded-2xl bg-blue-600 px-6 py-4 text-white shadow">
            <p className="text-sm">Total Appointments</p>

            <h2 className="text-3xl font-bold">{appointments.length}</h2>
          </div>
        </div>

        {/* Empty */}
        {appointments.length === 0 ? (
          <div className="mt-10 rounded-3xl bg-white p-12 text-center shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700">
              No appointments found
            </h2>
          </div>
        ) : (
          <div className="mt-10 grid gap-6">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="rounded-3xl bg-white p-6 shadow-md"
              >
                <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                  {/* Left */}
                  <div className="flex flex-col gap-5 md:flex-row md:items-center">
                    {/* Patient */}
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                        {appointment.patientName?.charAt(0)}
                      </div>

                      <div>
                        <h2 className="text-xl font-bold">
                          {appointment.patientName}
                        </h2>

                        <p className="text-gray-500">
                          {appointment.patientEmail}
                        </p>
                      </div>
                    </div>

                    {/* Doctor */}
                    <div className="rounded-2xl bg-gray-50 px-5 py-4">
                      <p className="text-sm text-gray-500">Doctor</p>

                      <p className="font-semibold">
                        Dr. {appointment.doctorName}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap gap-6">
                    <div className="rounded-2xl bg-gray-50 px-5 py-4">
                      <p className="text-sm text-gray-500">Date</p>

                      <p className="font-semibold">{appointment.date}</p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 px-5 py-4">
                      <p className="text-sm text-gray-500">Time</p>

                      <p className="font-semibold">{appointment.time}</p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 px-5 py-4">
                      <p className="text-sm text-gray-500">Fee</p>

                      <p className="font-semibold">₹{appointment.fee}</p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 px-5 py-4">
                      <p className="text-sm text-gray-500">Payment</p>

                      <p
                        className={`font-semibold capitalize ${
                          appointment.paymentStatus === "paid"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {appointment.paymentStatus}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 px-5 py-4">
                      <p className="text-sm text-gray-500">Status</p>

                      <p
                        className={`font-semibold capitalize ${
                          appointment.status === "approved"
                            ? "text-green-600"
                            : appointment.status === "rejected"
                              ? "text-red-600"
                              : "text-yellow-600"
                        }`}
                      >
                        {appointment.status}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => updateStatus(appointment._id, "approved")}
                      className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => updateStatus(appointment._id, "rejected")}
                      className="rounded-xl bg-yellow-500 px-5 py-3 font-semibold text-white hover:bg-yellow-600"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => deleteAppointment(appointment._id)}
                      className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
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
