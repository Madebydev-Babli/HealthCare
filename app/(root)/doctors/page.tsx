import { connectDB } from "@/lib/db";
import Doctor from "@/lib/models/doctor";

import DoctorHero from "@/components/doctors/DoctorHero";
import DoctorsSection from "@/components/doctors/DoctorSection";

async function getDoctors() {
  await connectDB();

  const doctors = await Doctor.find(
    { status: "approved" },
    {
      name: 1,
      image: 1,
      fieldOfMedical: 1,
      experience: 1,
      degree: 1,
      appointmentFee: 1,
      appointmentDetails: 1,
      licenseNumber: 1,
    },
  ).lean();

  return doctors.map((doctor: any) => ({
    _id: doctor._id.toString(),
    name: doctor.name,
    image: doctor.image,
    fieldOfMedical: doctor.fieldOfMedical,
    experience: doctor.experience,
    degree: doctor.degree,
    appointmentFee: doctor.appointmentFee,
    appointmentDetails: doctor.appointmentDetails,
    licenseNumber: doctor.licenseNumber,
  }));
}

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <>
      <DoctorHero />
      <DoctorsSection doctors={doctors} />
    </>
  );
}
