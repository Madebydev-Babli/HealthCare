import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Notification from "@/lib/models/notification";
import UserModel from "@/lib/models/user";

async function getRecipientId() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  // For admin, use the session ID directly
  if (session.user.role === "admin") {
    return session.user.id;
  }

  // For regular users, get their ObjectId from User model
  const user = await UserModel.findById(session.user.id).lean();
  return user ? user._id.toString() : null;
}

// Mark single notification as read
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const recipientId = await getRecipientId();

    if (!recipientId) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Verify notification belongs to user
    const notification = await Notification.findById(id).lean();

    if (!notification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    if (notification.recipientId.toString() !== recipientId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    const updated = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH notification error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete notification
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const recipientId = await getRecipientId();

    if (!recipientId) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Verify notification belongs to user
    const notification = await Notification.findById(id).lean();

    if (!notification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    if (notification.recipientId.toString() !== recipientId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    await Notification.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Notification deleted",
    });
  } catch (error) {
    console.error("DELETE notification error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
