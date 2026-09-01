import { connectDB } from "@/lib/db";
import Appointment from "@/lib/models/appointment";

const allowedStatuses = [
  "pending",
  "approved",
  "rejected",
  "completed",
  "cancelled",
];

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();

    const { id } = await params;

    const body = await req.json();
    const { status } = body;

    console.log("Appointment ID:", id);
    console.log("New status:", status);

    if (!status || !allowedStatuses.includes(status)) {
      return Response.json(
        { message: "Invalid appointment status" },
        { status: 400 },
      );
    }

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!updated) {
      return Response.json(
        { message: "Appointment not found" },
        { status: 404 },
      );
    }

    return Response.json({
      message: "Appointment updated successfully",
      appointment: updated,
    });
  } catch (error) {
    console.error("UPDATE APPOINTMENT ERROR:", error);

    return Response.json(
      { message: "Failed to update appointment" },
      { status: 500 },
    );
  }
}
