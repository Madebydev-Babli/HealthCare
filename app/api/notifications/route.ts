import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Notification from "@/lib/models/notification";
import UserModel from "@/lib/models/user";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get("unread") === "true";
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const type = searchParams.get("type");

    // Get actual ObjectId for user if they have one in User model
    let recipientId = session.user.id;
    
    // For regular users (not admin), verify they exist in User model
    if (session.user.role !== "admin") {
      const user = await UserModel.findById(session.user.id).lean();
      if (!user) {
        return NextResponse.json(
          { notifications: [], unreadCount: 0 },
          { status: 200 }
        );
      }
      recipientId = user._id.toString();
    }

    let query: any = {
      recipientId,
    };

    if (unreadOnly) {
      query.isRead = false;
    }

    if (type) {
      query.type = type;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const unreadCount = await Notification.countDocuments({
      recipientId,
      isRead: false,
    });

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("GET notifications error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
