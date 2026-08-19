import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";

import Appointment from "@/lib/models/appointment";
import Doctor from "@/lib/models/doctor";
import Patient from "@/lib/models/patient";

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
      return NextResponse.json([]);
    }

    const appointments = await Appointment.find({
      doctorId: doctor._id,
    });

    const patientIds = [...new Set(appointments.map((a) => a.patientId))];

    const patients = await Patient.find({
      userId: {
        $in: patientIds,
      },
    });

    const result = patients.map((patient) => {
      const patientAppointments = appointments.filter(
        (a) => a.patientId === String(patient.userId),
      );

      return {
        _id: patient._id,

        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        gender: patient.gender,
        bloodGroup: patient.bloodGroup,
        address: patient.address,
        dateOfBirth: patient.dateOfBirth,

        totalVisits: patientAppointments.length,

        lastVisit:
          patientAppointments.length > 0
            ? patientAppointments[patientAppointments.length - 1].date
            : null,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
