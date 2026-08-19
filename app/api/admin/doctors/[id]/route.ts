import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Doctor from "@/lib/models/doctor";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// ✅ UPDATE STATUS
export async function PUT(req: Request, { params }: Params) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await req.json();

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      {
        status: body.status,
        verified: body.status === "approved",
      },
      {
        new: true,
      },
    );

    return NextResponse.json(doctor);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Failed to update doctor" },
      { status: 500 },
    );
  }
}

// ✅ DELETE DOCTOR
export async function DELETE(req: Request, { params }: Params) {
  try {
    await connectDB();

    const { id } = await params;

    await Doctor.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Doctor deleted",
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Failed to delete doctor" },
      { status: 500 },
    );
  }
}
