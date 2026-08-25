import { redirect } from "next/navigation";

export default function DoctorProfileRedirectPage() {
  redirect("/dashboard/doctor/profile/create");
}
