import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";

import Appointment from "@/lib/models/appointment";
import DoctorProfile from "@/lib/models/doctor";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Find current doctor's profile
    const doctor = await DoctorProfile.findOne({
      userId: session.user.id,
    });

    if (!doctor) {
      return NextResponse.json([]);
    }

    // Get only this doctor's appointments
    const appointments = await Appointment.find({
      doctorId: doctor._id,
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
