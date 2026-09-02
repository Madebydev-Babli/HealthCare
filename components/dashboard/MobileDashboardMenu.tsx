"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

interface MobileMenuLink {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

interface MobileDashboardMenuProps {
  links: MobileMenuLink[];
  onLogout?: () => void;
  showBackToHome?: boolean;
}

export default function MobileDashboardMenu({
  links,
  onLogout,
  showBackToHome = true,
}: MobileDashboardMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleNavigation = () => {
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <nav className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg overflow-y-auto">
            <div className="p-6">
              <div className="mb-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="space-y-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleNavigation}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                      pathname === link.href
                        ? "bg-cyan-500 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Back to Home */}
              {showBackToHome && (
                <div className="mt-6 border-t border-slate-200 pt-4">
                  <Link
                    href="/"
                    onClick={handleNavigation}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
                  >
                    Back to Home
                  </Link>
                </div>
              )}

              {/* Logout */}
              {onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    handleNavigation();
                    onLogout();
                  }}
                  className="mt-2 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              )}
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
