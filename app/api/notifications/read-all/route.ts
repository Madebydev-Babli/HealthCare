import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Notification from "@/lib/models/notification";
import UserModel from "@/lib/models/user";

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    let recipientId = session.user.id;

    // For regular users, get their ObjectId from User model
    if (session.user.role !== "admin") {
      const user = await UserModel.findById(session.user.id).lean();
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
      recipientId = user._id.toString();
    }

    const result = await Notification.updateMany(
      {
        recipientId,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    return NextResponse.json({
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Mark all read error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
