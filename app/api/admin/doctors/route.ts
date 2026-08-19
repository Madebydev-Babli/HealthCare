import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Doctor from "@/lib/models/doctor";

export async function GET() {
  try {
    await connectDB();

    const doctors = await Doctor.find().sort({
      createdAt: -1,
    });

    return NextResponse.json(doctors);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch doctors" },
      { status: 500 },
    );
  }
}
