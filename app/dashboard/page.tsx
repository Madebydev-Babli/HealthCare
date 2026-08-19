// app/dashboard/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardRedirect() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  switch (session.user.role) {
    case "admin":
      redirect("/dashboard/admin");

    case "doctor":
      redirect("/dashboard/doctor");

    case "patient":
      redirect("/dashboard/patient");

    default:
      redirect("/");
  }
}
