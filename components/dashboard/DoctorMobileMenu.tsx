"use client";

import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Clock3,
  User,
} from "lucide-react";
import MobileDashboardMenu from "./MobileDashboardMenu";

const doctorLinks = [
  {
    href: "/dashboard/doctor",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    href: "/dashboard/doctor/appointments",
    label: "Appointments",
    icon: <Calendar size={18} />,
  },
  {
    href: "/dashboard/doctor/patients",
    label: "Patients",
    icon: <Users size={18} />,
  },
  {
    href: "/dashboard/doctor/prescriptions",
    label: "Prescriptions",
    icon: <FileText size={18} />,
  },
  {
    href: "/dashboard/doctor/availability",
    label: "Availability",
    icon: <Clock3 size={18} />,
  },
  {
    href: "/dashboard/doctor/profile/create",
    label: "Profile",
    icon: <User size={18} />,
  },
];

export default function DoctorMobileMenu() {
  return (
    <MobileDashboardMenu
      links={doctorLinks}
      onLogout={() => signOut({ callbackUrl: "/auth/login" })}
      showBackToHome={true}
    />
  );
}
