import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";

import Patient from "@/lib/models/patient";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const patient = await Patient.findOne({
      userId: session.user.id,
    });

    return NextResponse.json({
      hasProfile: !!patient,
      patient,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const existingPatient = await Patient.findOne({
      userId: session.user.id,
    });

    if (existingPatient) {
      return NextResponse.json(
        { message: "Profile already exists" },
        { status: 400 },
      );
    }

    const patient = await Patient.create({
      userId: session.user.id,

      name: body.name,
      email: body.email,
      phone: body.phone,
      gender: body.gender,
      dateOfBirth: body.dateOfBirth,
      bloodGroup: body.bloodGroup,
      address: body.address,
    });

    return NextResponse.json(patient);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Failed to create profile" },
      { status: 500 },
    );
  }
}
