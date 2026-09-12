import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Doctor from "@/lib/models/doctor";
import { createNotification } from "@/lib/notifications";

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

    if (!doctor) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 },
      );
    }

    // ✅ Send notification to doctor based on status
    try {
      if (body.status === "approved") {
        await createNotification({
          recipientId: doctor.userId.toString(),
          recipientRole: "doctor",
          title: "Doctor profile verified",
          message: "Your doctor profile has been approved by the admin.",
          type: "profile",
          relatedId: doctor._id.toString(),
        });
      } else if (body.status === "rejected") {
        await createNotification({
          recipientId: doctor.userId.toString(),
          recipientRole: "doctor",
          title: "Doctor profile rejected",
          message: "Your doctor profile was rejected by the admin.",
          type: "profile",
          relatedId: doctor._id.toString(),
        });
      }
    } catch (notificationError) {
      console.error("Failed to create notification:", notificationError);
      // Don't fail the doctor update if notification fails
    }

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
