import { ReactNode } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Patient from "@/lib/models/patient";
import PatientSidebar from "@/components/dashboard/PatientSidebar";

export default async function PatientLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (session.user.role !== "patient") {
    redirect("/");
  }

  await connectDB();

  const patient = await Patient.findOne({
    userId: session.user.id,
  });

  const mobileLinks = [
    { href: "/dashboard/patient", label: "Dashboard" },
    { href: "/appointments", label: "Appointments" },
    { href: "/doctors", label: "Doctors" },
    { href: "/dashboard/patient/profile", label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <PatientSidebar />

        <main className="flex-1 min-w-0">
          <div className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {mobileLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="min-h-screen">{children}</div>
        </main>
      </div>
    </div>
  );
}
