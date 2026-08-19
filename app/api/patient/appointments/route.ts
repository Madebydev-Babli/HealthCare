import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";

import Appointment from "@/lib/models/appointment";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const appointments = await Appointment.find({
    patientId: session.user.id,
  }).populate("doctorId", "name image fieldOfMedical");

  return NextResponse.json(appointments);
}
