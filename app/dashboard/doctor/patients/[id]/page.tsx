"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Patient = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  bloodGroup: string;
  address: string;
};

type Appointment = {
  _id: string;
  date: string;
  time: string;
  status: string;
};

export default function PatientDetailsPage() {
  const params = useParams();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchPatient = async () => {
      const res = await fetch(`/api/doctor/patients/${params.id}`);

      const data = await res.json();

      setPatient(data.patient);
      setAppointments(data.appointments);
    };

    fetchPatient();
  }, [params.id]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold">{patient.name}</h1>

        <p className="mt-2 text-slate-500">{patient.email}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <InfoCard title="Phone" value={patient.phone || "-"} />

          <InfoCard title="Gender" value={patient.gender || "-"} />

          <InfoCard title="Blood Group" value={patient.bloodGroup || "-"} />

          <InfoCard title="Address" value={patient.address || "-"} />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold">Appointment History</h2>

        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="flex items-center justify-between rounded-2xl border p-4"
            >
              <div>
                <p className="font-semibold">{appointment.date}</p>

                <p className="text-sm text-slate-500">{appointment.time}</p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                {appointment.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{title}</p>

      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
