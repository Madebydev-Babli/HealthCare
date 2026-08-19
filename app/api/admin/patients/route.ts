import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";

export async function GET() {
  try {
    await connectDB();

    const patients = await User.find().sort({
      createdAt: -1,
    });

    return NextResponse.json(patients);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch doctors" },
      { status: 500 },
    );
  }
}
