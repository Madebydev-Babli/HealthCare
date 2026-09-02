import DoctorSidebar from "@/components/dashboard/Doctor-SideBar";
import DoctorMobileMenu from "@/components/dashboard/DoctorMobileMenu";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <DoctorSidebar />

      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 py-3">
          <DoctorMobileMenu />
        </div>

        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
