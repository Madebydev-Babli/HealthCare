import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";

import Patient from "@/lib/models/patient";

export default async function PatientDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  await connectDB();

  const patient = await Patient.findOne({
    userId: session.user.id,
  });

  if (!patient) {
    redirect("/dashboard/patient/profile");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {patient.name}</h1>

        <p className="text-slate-500">
          Manage appointments and healthcare records.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <DashboardCard title="Appointments" value="0" />

        <DashboardCard title="Upcoming" value="0" />

        <DashboardCard title="Completed" value="0" />

        <DashboardCard title="Records" value="0" />
      </div>
    </div>
  );
}

function DashboardCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-slate-500">{title}</p>

      <h2 className="mt-3 text-4xl font-bold">{value}</h2>
    </div>
  );
}
