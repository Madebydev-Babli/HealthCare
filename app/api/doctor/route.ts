import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";

import Doctor from "@/lib/models/doctor";
import Appointment from "@/lib/models/appointment";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const doctor = await Doctor.findOne({
      userId: session.user.id,
    });

    if (!doctor) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 },
      );
    }

    const appointments = await Appointment.find({
      doctorId: doctor._id.toString(),
    }).sort({
      createdAt: -1,
    });

    const totalAppointments = appointments.length;

    const pendingAppointments = appointments.filter(
      (a) => a.status === "pending",
    ).length;

    const approvedAppointments = appointments.filter(
      (a) => a.status === "approved",
    ).length;

    const completedAppointments = appointments.filter(
      (a) => a.status === "completed",
    ).length;

    const uniquePatients = new Set(appointments.map((a) => a.patientId)).size;

    return NextResponse.json({
      doctor,
      recentAppointments: appointments.slice(0, 5),

      stats: {
        totalAppointments,
        pendingAppointments,
        approvedAppointments,
        completedAppointments,
        totalPatients: uniquePatients,
      },
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
