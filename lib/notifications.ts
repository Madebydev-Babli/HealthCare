import Notification from "@/lib/models/notification";
import { connectDB } from "@/lib/db";

export interface CreateNotificationParams {
  recipientId: string;
  recipientRole: "admin" | "doctor" | "patient";
  title: string;
  message: string;
  type: "appointment" | "payment" | "doctor" | "profile" | "system";
  relatedId?: string;
}

export async function createNotification({
  recipientId,
  recipientRole,
  title,
  message,
  type,
  relatedId,
}: CreateNotificationParams) {
  try {
    await connectDB();

    // Prevent creating duplicate notifications within 5 seconds
    // This helps prevent double notifications from the same event
    const recentNotification = await Notification.findOne({
      recipientId,
      title,
      message,
      type,
      createdAt: {
        $gte: new Date(Date.now() - 5000), // Within last 5 seconds
      },
    });

    if (recentNotification) {
      return recentNotification;
    }

    const notification = await Notification.create({
      recipientId,
      recipientRole,
      title,
      message,
      type,
      relatedId: relatedId || null,
      isRead: false,
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

export async function getUnreadCount(recipientId: string) {
  try {
    await connectDB();

    const count = await Notification.countDocuments({
      recipientId,
      isRead: false,
    });

    return count;
  } catch (error) {
    console.error("Error getting unread count:", error);
    return 0;
  }
}
