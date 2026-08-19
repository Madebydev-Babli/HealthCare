"use client";

import { useEffect, useState } from "react";

export default function PatientAppointments() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/patient/appointments")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const getStatusColor = (status: string) => {
    if (status === "confirmed") return "text-green-600";
    if (status === "rejected") return "text-red-600";
    return "text-yellow-600";
  };

  return (
    <div className="bg-white shadow rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Doctor</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((a: any) => (
            <tr key={a._id} className="border-b">
              <td className="p-3">{a.doctorId?.name}</td>
              <td>{a.date}</td>
              <td>{a.time}</td>
              <td className={getStatusColor(a.status)}>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <p className="p-4 text-center text-gray-500">No appointments yet</p>
      )}
    </div>
  );
}
