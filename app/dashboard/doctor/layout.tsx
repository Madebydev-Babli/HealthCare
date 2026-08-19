import DoctorSidebar from "@/components/dashboard/Doctor-SideBar";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <DoctorSidebar />

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
