import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Patient from "@/lib/models/patient";

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

  return <>{!patient ? <div>{children}</div> : <div>{children}</div>}</>;
}
