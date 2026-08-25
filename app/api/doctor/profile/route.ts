import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Doctor from "@/lib/models/doctor";

// ===================== GET =====================

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const doctor = await Doctor.findOne({
      userId: session.user.id,
    });

    return NextResponse.json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

// ===================== POST =====================

export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const body = await req.json();

    const requiredFields = [
      "name",
      "gender",
      "dob",
      "phone",
      "specialization",
      "degree",
      "experience",
      "licenseNumber",
      "consultationFee",
      "consultationMode",
      "bio",
    ];

    const missingFields = requiredFields.filter(
      (field) =>
        body[field] === undefined ||
        body[field] === null ||
        (typeof body[field] === "string" && !body[field].trim()),
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Please complete all required profile fields. Missing: ${missingFields.join(", ")}`,
        },
        { status: 400 },
      );
    }

    if (!body.clinic?.name || !body.clinic?.city || !body.clinic?.state) {
      return NextResponse.json(
        {
          success: false,
          message: "Clinic name, city, and state are required",
        },
        { status: 400 },
      );
    }

    if (!body.availability || typeof body.availability !== "object") {
      return NextResponse.json(
        {
          success: false,
          message: "Availability is required",
        },
        { status: 400 },
      );
    }

    const existingDoctor = await Doctor.findOne({
      userId: session.user.id,
    });

    const doctorPayload = {
      userId: session.user.id,

      // Personal
      name: body.name,
      image: body.image,
      gender: body.gender,
      dob: body.dob,
      phone: body.phone,

      // Professional
      specialization: body.specialization,
      degree: body.degree,
      experience: Number(body.experience),
      licenseNumber: body.licenseNumber,
      bio: body.bio,
      consultationFee: Number(body.consultationFee),
      consultationMode: body.consultationMode,
      languages: body.languages || [],

      // Clinic
      clinic: {
        name: body.clinic?.name,
        images: body.clinic?.images || [],
        address: body.clinic?.address,
        city: body.clinic?.city,
        state: body.clinic?.state,
        pincode: body.clinic?.pincode,
        landmark: body.clinic?.landmark,
        phone: body.clinic?.phone,
        mapLink: body.clinic?.mapLink,
        coordinates: body.clinic?.coordinates || {},
      },

      // Availability
      availability: body.availability,
      profileCompleted: true,
    };

    let doctor;

    if (existingDoctor) {
      doctor = await Doctor.findOneAndUpdate(
        { userId: session.user.id },
        { $set: doctorPayload },
        { new: true, runValidators: true },
      );
    } else {
      doctor = await Doctor.create(doctorPayload);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profile created successfully",
        doctor,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create profile",
      },
      { status: 500 },
    );
  }
}

// ===================== PUT =====================

export async function PUT(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const body = await req.json();

    // Never allow doctor to edit these fields
    delete body.userId;
    delete body.status;
    delete body.verified;
    delete body.totalAppointments;
    delete body.totalPatients;
    delete body.totalEarnings;
    delete body.rating;
    delete body.reviews;

    const doctor = await Doctor.findOneAndUpdate(
      {
        userId: session.user.id,
      },
      {
        $set: body,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!doctor) {
      return NextResponse.json(
        {
          success: false,
          message: "Doctor profile not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      doctor,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update profile",
      },
      { status: 500 },
    );
  }
}
