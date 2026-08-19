"use client";

import { useEffect, useMemo, useState } from "react";

type Appointment = {
  _id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  fee: number;
  paymentStatus: "pending" | "paid";
  status: "pending" | "approved" | "rejected" | "completed";
};

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/doctor/appointments");

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

  const updateStatus = async (appointmentId: string, status: string) => {
    try {
      await fetch(`/api/appointments/${appointmentId}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          status,
        }),
      });

      fetchAppointments();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesSearch =
        appointment.patientName.toLowerCase().includes(search.toLowerCase()) ||
        appointment.patientEmail.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ? true : appointment.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [appointments, search, filter]);

  const totalAppointments = appointments.length;

  const pendingAppointments = appointments.filter(
    (a) => a.status === "pending",
  ).length;

  const approvedAppointments = appointments.filter(
    (a) => a.status === "approved",
  ).length;

  const completedAppointments = appointments.filter(
    (a) => a.status === "completed",
  ).length;

  const rejectedAppointments = appointments.filter(
    (a) => a.status === "rejected",
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Appointments</h1>

        <p className="mt-2 text-slate-500">Manage all patient appointments.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total" value={totalAppointments} />

        <StatCard title="Pending" value={pendingAppointments} />

        <StatCard title="Approved" value={approvedAppointments} />

        <StatCard title="Completed" value={completedAppointments} />

        <StatCard title="Rejected" value={rejectedAppointments} />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <input
          type="text"
          placeholder="Search patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500 md:max-w-sm"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="all">All Status</option>

          <option value="pending">Pending</option>

          <option value="approved">Approved</option>

          <option value="completed">Completed</option>

          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left">Patient</th>

                <th className="px-6 py-4 text-left">Date</th>

                <th className="px-6 py-4 text-left">Time</th>

                <th className="px-6 py-4 text-left">Fee</th>

                <th className="px-6 py-4 text-left">Payment</th>

                <th className="px-6 py-4 text-left">Status</th>

                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment._id} className="border-b">
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-semibold">{appointment.patientName}</p>

                      <p className="text-sm text-slate-500">
                        {appointment.patientEmail}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-5">{appointment.date}</td>

                  <td className="px-6 py-5">{appointment.time}</td>

                  <td className="px-6 py-5">₹{appointment.fee}</td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        appointment.paymentStatus === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {appointment.paymentStatus}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        appointment.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : appointment.status === "completed"
                            ? "bg-blue-100 text-blue-700"
                            : appointment.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-2">
                      {appointment.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              updateStatus(appointment._id, "approved")
                            }
                            className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              updateStatus(appointment._id, "rejected")
                            }
                            className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {appointment.status === "approved" && (
                        <button
                          onClick={() =>
                            updateStatus(appointment._id, "completed")
                          }
                          className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>

      <h3 className="mt-2 text-3xl font-bold">{value}</h3>
    </div>
  );
}
