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
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900">Patients</h1>

        <p className="mt-2 text-slate-600">All registered patients</p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200">
        <table className="w-full">
          <thead className="bg-cyan-600 text-white">
            <tr>
              <th className="p-5 text-left font-semibold">Patient</th>

              <th className="p-5 text-left font-semibold">Email</th>

              <th className="p-5 text-left font-semibold">Role</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((patient: any) => (
              <tr
                key={patient._id}
                className="border-b border-slate-200 hover:bg-slate-50 transition"
              >
                <td className="p-5 font-semibold text-slate-900">
                  {patient.name}
                </td>

                <td className="p-5 text-slate-600">{patient.email}</td>

                <td className="p-5">
                  <span className="rounded-full bg-cyan-100 px-3 py-1 text-sm font-medium text-cyan-700">
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
