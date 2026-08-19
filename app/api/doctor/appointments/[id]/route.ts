import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Appointment from "@/lib/models/appointment";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    // ✅ unwrap params
    const { id } = await context.params;

    // ✅ get status from frontend
    const { status } = await req.json();

    // ✅ update appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
        },
      },
      {
        returnDocument: "after",
      },
    );

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Failed to update appointment" },
      { status: 500 },
    );
  }
}
