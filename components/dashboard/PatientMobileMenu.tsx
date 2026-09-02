"use client";

import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarDays,
  Stethoscope,
  UserRound,
} from "lucide-react";
import MobileDashboardMenu from "./MobileDashboardMenu";

const patientLinks = [
  {
    href: "/dashboard/patient",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    href: "/appointments",
    label: "My Appointments",
    icon: <CalendarDays size={18} />,
  },
  {
    href: "/doctors",
    label: "Find Doctors",
    icon: <Stethoscope size={18} />,
  },
  {
    href: "/dashboard/patient/profile",
    label: "Profile",
    icon: <UserRound size={18} />,
  },
];

export default function PatientMobileMenu() {
  return (
    <MobileDashboardMenu
      links={patientLinks}
      onLogout={() => signOut({ callbackUrl: "/auth/login" })}
      showBackToHome={true}
    />
  );
}
