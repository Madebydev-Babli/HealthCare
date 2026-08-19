"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    {
      name: "Dashboard",
      href: "/admin",
    },
    {
      name: "Doctors",
      href: "/admin/doctors",
    },
    {
      name: "Patients",
      href: "/admin/patients",
    },
    {
      name: "Appointments",
      href: "/admin/appointments",
    },
  ];

  return (
    <div className="sticky top-0 h-screen w-72 bg-white shadow-xl">
      {/* Logo */}
      <div className="border-b p-6">
        <h1 className="text-3xl font-bold text-blue-600">CareBridge Admin</h1>

        <p className="mt-1 text-sm text-gray-500">Clinic Management Panel</p>
      </div>

      {/* Navigation */}
      <div className="space-y-3 p-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded-2xl px-5 py-4 font-medium transition ${
              pathname === link.href
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
