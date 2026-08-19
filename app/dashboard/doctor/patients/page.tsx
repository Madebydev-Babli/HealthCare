"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Users,
  Phone,
  Mail,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

type Patient = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  bloodGroup: string;
  dateOfBirth: string;
  address: string;
  totalVisits: number;
  lastVisit: string;
};

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("/api/doctor/patients");
        const data = await res.json();

        setPatients(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    return patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(search.toLowerCase()) ||
        patient.email.toLowerCase().includes(search.toLowerCase()) ||
        patient.phone.includes(search),
    );
  }, [patients, search]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-lg font-medium text-slate-500">
          Loading patients...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Patients</h1>

        <p className="mt-2 text-slate-500">
          View and manage all patient records.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-100 p-3">
              <Users className="text-cyan-600" />
            </div>

            <div>
              <p className="text-slate-500">Total Patients</p>

              <h2 className="text-3xl font-bold">{patients.length}</h2>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-slate-500">Total Visits</p>

          <h2 className="mt-3 text-3xl font-bold text-blue-600">
            {patients.reduce((sum, patient) => sum + patient.totalVisits, 0)}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-slate-500">Active Patients</p>

          <h2 className="mt-3 text-3xl font-bold text-green-600">
            {patients.length}
          </h2>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredPatients.map((patient) => (
          <div
            key={patient._id}
            className="rounded-3xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Top */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {patient.name}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {patient.gender} • {patient.bloodGroup}
                </p>
              </div>

              <div className="rounded-2xl bg-cyan-50 p-3">
                <Users size={20} className="text-cyan-600" />
              </div>
            </div>

            {/* Contact */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-slate-400" />

                <span className="text-sm">{patient.phone}</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={16} className="text-slate-400" />

                <span className="text-sm">{patient.email}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Visits</p>

                <h4 className="mt-1 text-xl font-bold">
                  {patient.totalVisits}
                </h4>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Last Visit</p>

                <h4 className="mt-1 text-sm font-semibold">
                  {patient.lastVisit}
                </h4>
              </div>
            </div>

            {/* Action */}
            <Link
              href={`/dashboard/doctor/patients/${patient._id}`}
              className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 py-3 font-medium text-white transition hover:bg-cyan-600"
            >
              View Patient
              <ArrowRight size={18} />
            </Link>
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
          <Users size={50} className="mx-auto text-slate-300" />

          <h3 className="mt-4 text-xl font-semibold">No Patients Found</h3>

          <p className="mt-2 text-slate-500">No patients match your search.</p>
        </div>
      )}
    </div>
  );
}
