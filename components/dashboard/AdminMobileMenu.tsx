"use client";

import { signOut } from "next-auth/react";
import { LayoutDashboard, Users, Calendar, Stethoscope } from "lucide-react";
import MobileDashboardMenu from "./MobileDashboardMenu";

const adminLinks = [
  {
    href: "/dashboard/admin",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    href: "/dashboard/admin/doctors",
    label: "Doctors",
    icon: <Stethoscope size={18} />,
  },
  {
    href: "/dashboard/admin/patients",
    label: "Patients",
    icon: <Users size={18} />,
  },
  {
    href: "/dashboard/admin/appointments",
    label: "Appointments",
    icon: <Calendar size={18} />,
  },
];

export default function AdminMobileMenu() {
  return (
    <MobileDashboardMenu
      links={adminLinks}
      onLogout={() => signOut({ callbackUrl: "/auth/login" })}
      showBackToHome={true}
    />
  );
}
