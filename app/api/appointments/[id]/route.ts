import { connectDB } from "@/lib/db";
import Appointment from "@/lib/models/appointment";
import { createNotification } from "@/lib/notifications";
import UserModel from "@/lib/models/user";

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

    // ✅ Send notifications based on status change
    try {
      if (status === "approved") {
        // Notify patient that appointment was approved
        const patientUser = await UserModel.findById(updated.patientId);
        if (patientUser) {
          await createNotification({
            recipientId: updated.patientId,
            recipientRole: "patient",
            title: "Appointment approved",
            message: `Your appointment with Dr. ${updated.doctorName} has been approved.`,
            type: "appointment",
            relatedId: updated._id.toString(),
          });
        }
      } else if (status === "rejected") {
        // Notify patient that appointment was rejected
        const patientUser = await UserModel.findById(updated.patientId);
        if (patientUser) {
          await createNotification({
            recipientId: updated.patientId,
            recipientRole: "patient",
            title: "Appointment rejected",
            message: `Your appointment with Dr. ${updated.doctorName} was rejected.`,
            type: "appointment",
            relatedId: updated._id.toString(),
          });
        }
      } else if (status === "cancelled") {
        // Notify doctor that appointment was cancelled
        const doctorUser = await UserModel.findById(updated.doctorId);
        if (doctorUser) {
          await createNotification({
            recipientId: updated.doctorId,
            recipientRole: "doctor",
            title: "Appointment cancelled",
            message: `${updated.patientName} cancelled an appointment.`,
            type: "appointment",
            relatedId: updated._id.toString(),
          });
        }
      }
    } catch (notificationError) {
      console.error("Failed to create notification:", notificationError);
      // Don't fail the appointment update if notification fails
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
