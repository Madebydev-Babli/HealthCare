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

    // Logged in doctor
    const doctor = await Doctor.findOne({
      userId: session.user.id,
    }).lean();

    if (!doctor) {
      return NextResponse.json(
        { message: "Doctor profile not found" },
        { status: 404 },
      );
    }

    // Doctor appointments
    const appointments = await Appointment.find({
      doctorId: doctor._id.toString(),
    })
      .sort({ createdAt: -1 })
      .lean();

    // ===========================
    // Dashboard Statistics
    // ===========================

    const totalAppointments = appointments.length;

    const pendingAppointments = appointments.filter(
      (appointment: any) => appointment.status === "pending",
    ).length;

    const approvedAppointments = appointments.filter(
      (appointment: any) => appointment.status === "approved",
    ).length;

    const completedAppointments = appointments.filter(
      (appointment: any) => appointment.status === "completed",
    ).length;

    const cancelledAppointments = appointments.filter(
      (appointment: any) => appointment.status === "rejected",
    ).length;

    const totalPatients = new Set(
      appointments.map((appointment: any) => appointment.patientId),
    ).size;

    const totalEarnings = appointments
      .filter((appointment: any) => appointment.paymentStatus === "paid")
      .reduce((sum: number, appointment: any) => sum + appointment.fee, 0);

    // ===========================
    // Today's Appointments
    // ===========================

    const today = new Date().toISOString().split("T")[0];

    const todayAppointments = appointments.filter(
      (appointment: any) => appointment.date === today,
    );

    // ===========================
    // Recent Patients
    // ===========================

    const uniquePatients = new Map();

    appointments.forEach((appointment: any) => {
      if (!uniquePatients.has(appointment.patientId)) {
        uniquePatients.set(appointment.patientId, {
          _id: appointment.patientId,
          name: appointment.patientName,
          email: appointment.patientEmail,
        });
      }
    });

    const recentPatients = Array.from(uniquePatients.values()).slice(0, 5);

    // ===========================
    // Response
    // ===========================

    return NextResponse.json({
      doctor,

      stats: {
        totalAppointments,
        totalPatients,
        pendingAppointments,
        totalEarnings,
      },

      appointmentOverview: {
        total: totalAppointments,
        pending: pendingAppointments,
        approved: approvedAppointments,
        completed: completedAppointments,
        cancelled: cancelledAppointments,
      },

      todayAppointments,

      recentPatients,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
