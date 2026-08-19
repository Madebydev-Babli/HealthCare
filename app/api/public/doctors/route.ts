import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Doctor from "@/lib/models/doctor";

export async function GET() {
  try {
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

    const payload = doctors.map((doc: any) => ({
      _id: doc._id.toString(),
      name: doc.name,
      image: doc.image,
      fieldOfMedical: doc.fieldOfMedical,
      experience: doc.experience,
      degree: doc.degree,
      appointmentFee: doc.appointmentFee,
      appointmentDetails: doc.appointmentDetails,
      licenseNumber: doc.licenseNumber,
    }));

    return NextResponse.json(payload);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
