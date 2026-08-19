"use client";

import { useEffect, useState } from "react";

type Appointment = {
  _id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: string;
};

export default function UpcomingAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch("/api/admin/dashboard/appointments");
        const data = await res.json();

        setAppointments(data.appointments || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        Loading appointments...
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white shadow-sm">
      <div className="border-b p-6">
        <h2 className="text-xl font-bold text-gray-800">
          Upcoming Appointments
        </h2>

        <p className="mt-1 text-sm text-gray-500">Latest booked appointments</p>
      </div>

      {appointments.length === 0 ? (
        <div className="p-10 text-center text-gray-400">
          No appointments found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-sm text-gray-600">
              <tr>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Doctor</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">
                    {appointment.patientName}
                  </td>

                  <td className="px-6 py-4">Dr. {appointment.doctorName}</td>

                  <td className="px-6 py-4">{appointment.date}</td>

                  <td className="px-6 py-4">{appointment.time}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        appointment.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : appointment.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
