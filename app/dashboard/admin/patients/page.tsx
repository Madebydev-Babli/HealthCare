"use client";

import { useEffect, useState } from "react";

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const res = await fetch("/api/admin/patients");

      const data = await res.json();

      setPatients(data);
    };

    fetchPatients();
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-8">
      <h1 className="text-4xl font-bold text-gray-800">Patients</h1>

      <p className="mt-2 text-gray-500">All registered patients</p>

      <div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-md">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-5 text-left">Patient</th>

              <th className="p-5 text-left">Email</th>

              <th className="p-5 text-left">Role</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((patient: any) => (
              <tr key={patient._id} className="border-b hover:bg-gray-50">
                <td className="p-5 font-semibold">{patient.name}</td>

                <td className="p-5">{patient.email}</td>

                <td className="p-5">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                    Patient
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
