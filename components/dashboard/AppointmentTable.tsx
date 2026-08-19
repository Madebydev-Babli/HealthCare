"use client";

import { useEffect, useState } from "react";

export default function AppointmentTable() {
  const [data, setData] = useState([]);

  // ✅ ADD FUNCTION HERE
  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/appointments/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });

    location.reload(); // temporary (we'll improve later)
  };

  useEffect(() => {
    fetch("/api/doctor/appointments")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>Patient</th>
          <th>Date</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {data.map((a: any) => (
          <tr key={a._id}>
            <td>{a.patientId.name}</td>
            <td>{a.date}</td>
            <td>{a.status}</td>
            <td>
              {/* 👇 USE FUNCTION HERE */}
              <button
                onClick={() => updateStatus(a._id, "confirmed")}
                className="text-green-600 mr-2"
              >
                Accept
              </button>

              <button
                onClick={() => updateStatus(a._id, "rejected")}
                className="text-red-600"
              >
                Reject
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
