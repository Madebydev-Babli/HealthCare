import mongoose from "mongoose";
import { MongoServerError } from "mongodb";
import { connectDB } from "../../../../lib/db";
import User from "../../../../lib/models/user";
import Doctor from "../../../../lib/models/doctor";
import { createNotification } from "@/lib/notifications";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  let userId: string | null = null;
  let session: mongoose.ClientSession | null = null;

  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return new Response("Missing signup fields", { status: 400 });
    }

    await connectDB();

    const lowerEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: lowerEmail });

    if (existingUser) {
      return new Response("User already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    try {
      session = await mongoose.startSession();

      await session.withTransaction(async () => {
        const [user] = await User.create(
          [
            {
              name: String(name).trim(),
              email: lowerEmail,
              password: hashedPassword,
              role,
            },
          ],
          { session },
        );

        userId = user._id.toString();

        if (role === "doctor") {
          await Doctor.create(
            [
              {
                userId: user._id,
                name: String(name).trim(),
                status: "pending",
                verified: false,
                profileCompleted: false,
              },
            ],
            { session },
          );
        }
      });
    } catch (transactionError) {
      console.error("Doctor signup transaction failed:", transactionError);

      if (
        transactionError instanceof MongoServerError &&
        transactionError.code === 11000
      ) {
        return new Response("User already exists", { status: 400 });
      }

      if (userId) {
        await User.findByIdAndDelete(userId).catch((deleteError) => {
          console.error("Rollback failed for orphaned user:", deleteError);
        });
      }

      throw transactionError;
    } finally {
      if (session) {
        await session.endSession();
      }
    }

    // ✅ Send notification to admin if doctor registered
    if (role === "doctor" && userId) {
      try {
        // Find the admin user to get their actual ObjectId
        const adminUser = await User.findOne({ role: "admin" }).lean();

        if (adminUser) {
          await createNotification({
            recipientId: adminUser._id.toString(),
            recipientRole: "admin",
            title: "New doctor registration",
            message: `A new doctor account has been created by ${String(name).trim()}. Please verify their profile.`,
            type: "doctor",
            relatedId: userId,
          });
        }
      } catch (notificationError) {
        console.error(
          "Failed to create admin notification:",
          notificationError,
        );
        // Don't fail the signup if notification fails
      }
    }

    return new Response("User created", { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);

    if (error instanceof MongoServerError && error.code === 11000) {
      return new Response("User already exists", { status: 400 });
    }

    return new Response("Failed to create user", { status: 500 });
  }
}
