import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import Doctor from "@/lib/models/doctor";
import User from "@/lib/models/user";
import Appointment from "@/lib/models/appointment";

export async function GET() {
  try {
    await connectDB();

    // Counts
    const doctors = await Doctor.countDocuments();

    const pendingDoctors = await Doctor.countDocuments({
      status: "pending",
    });

    const patients = await User.countDocuments({
      role: "patient",
    });

    const appointments = await Appointment.countDocuments();

    return NextResponse.json({
      doctors,
      pendingDoctors,
      patients,
      appointments,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Failed to fetch stats",
      },
      {
        status: 500,
      },
    );
  }
}
