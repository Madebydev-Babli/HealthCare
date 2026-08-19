import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import Patient from "@/lib/models/patient";
import Appointment from "@/lib/models/appointment";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    const patient = await Patient.findById(id);

    if (!patient) {
      return NextResponse.json(
        { message: "Patient not found" },
        { status: 404 },
      );
    }

    const appointments = await Appointment.find({
      patientId: patient.userId.toString(),
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      patient,
      appointments,
    });
  } catch (error) {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
