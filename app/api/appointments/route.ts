import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";

import Appointment from "@/lib/models/appointment";
import DoctorProfile from "@/lib/models/doctor";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // ✅ Check login
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { doctorId, date, time, fee } = body;

    // ✅ Validation
    if (!doctorId || !date || !time) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    // ✅ Doctor exists?
    const doctor = await DoctorProfile.findById(doctorId);

    if (!doctor) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 },
      );
    }

    // ✅ Doctor approved?
    if (doctor.status !== "approved") {
      return NextResponse.json(
        { message: "Doctor not approved yet" },
        { status: 400 },
      );
    }

    // ✅ Prevent duplicate booking
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: {
        $in: ["pending", "approved"],
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        {
          message: "This slot is already booked. Please choose another time.",
        },
        { status: 400 },
      );
    }

    // ✅ Create appointment
    const appointment = await Appointment.create({
      patientId: session.user.id,
      patientName: session.user.name,
      patientEmail: session.user.email,

      doctorId,
      doctorName: doctor.name,

      date,
      time,

      fee: fee || doctor.appointmentFee,

      paymentStatus: "pending",
      status: "pending",
    });

    return NextResponse.json(
      {
        message: "Appointment booked successfully",
        appointment,
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

// ✅ GET APPOINTMENTS
export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let appointments = [];

    // ✅ Doctor appointments (doctorId in Appointment references Doctor profile _id)
    if (session.user.role === "doctor") {
      // Resolve the doctor's profile by the logged-in user's id
      const doctorProfile = await DoctorProfile.findOne({
        userId: session.user.id,
      });

      if (doctorProfile) {
        appointments = await Appointment.find({
          doctorId: doctorProfile._id.toString(),
        }).sort({ createdAt: -1 });
      } else {
        appointments = [];
      }
    }

    // ✅ Patient appointments
    else if (session.user.role === "patient") {
      appointments = await Appointment.find({
        patientId: session.user.id,
      }).sort({ createdAt: -1 });
    }

    // ✅ Admin sees all
    else if (session.user.role === "admin") {
      appointments = await Appointment.find().sort({
        createdAt: -1,
      });
    }

    return NextResponse.json(appointments);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
