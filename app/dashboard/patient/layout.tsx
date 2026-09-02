import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import PatientSidebar from "@/components/dashboard/PatientSidebar";
import PatientMobileMenu from "@/components/dashboard/PatientMobileMenu";

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <PatientSidebar />

        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="lg:hidden border-b border-slate-200 bg-white px-4 py-3">
            <PatientMobileMenu />
          </div>

          <div className="min-h-screen p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
