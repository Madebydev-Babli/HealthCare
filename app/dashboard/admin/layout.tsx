import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import AdminMobileMenu from "@/components/dashboard/AdminMobileMenu";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 py-3">
          <AdminMobileMenu />
        </div>

        <div className="min-h-screen p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
