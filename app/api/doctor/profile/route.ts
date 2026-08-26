import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Doctor from "@/lib/models/doctor";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
const daySchema = z.object({
  available: z.boolean(),
  start: z.string(),
  end: z.string(),
});
const profileSchema = z
  .object({
    name: z.string().trim().min(1),
    image: z.string().url().or(z.literal("")),
    gender: z.enum(["Male", "Female", "Other"]),
    dob: z.string().min(1),
    phone: z.string().regex(/^[6-9]\d{9}$/),
    specialization: z.string().trim().min(1),
    degree: z.string().trim().min(1),
    experience: z.coerce.number().min(0),
    licenseNumber: z.string().trim().min(1),
    languages: z.array(z.string().trim().min(1)).min(1),
    consultationFee: z.coerce.number().min(0),
    consultationMode: z.enum(["Clinic", "Online", "Both"]),
    bio: z.string().trim().min(1),
    clinic: z.object({
      name: z.string(),
      images: z.array(z.string().url()),
      address: z.string(),
      city: z.string(),
      state: z.string(),
      pincode: z.string(),
      landmark: z.string(),
      phone: z.string(),
      mapLink: z.string().url().or(z.literal("")),
      coordinates: z.object({
        latitude: z.coerce.number(),
        longitude: z.coerce.number(),
      }),
    }),
    availability: z.object(
      Object.fromEntries(days.map((day) => [day, daySchema])) as Record<
        (typeof days)[number],
        typeof daySchema
      >,
    ),
  })
  .superRefine((value, ctx) => {
    for (const day of days) {
      const entry = value.availability[day];
      if (
        entry.available &&
        (!entry.start || !entry.end || entry.start >= entry.end)
      )
        ctx.addIssue({
          code: "custom",
          path: ["availability", day],
          message: "Available days need a valid time range",
        });
    }
    if (value.consultationMode !== "Online") {
      for (const field of [
        "name",
        "address",
        "city",
        "state",
        "pincode",
        "phone",
      ] as const)
        if (!value.clinic[field].trim())
          ctx.addIssue({
            code: "custom",
            path: ["clinic", field],
            message: `${field} is required`,
          });
    }
  });

async function getDoctor() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "doctor")
    return { session: null, doctor: null };
  const doctor = await Doctor.findOne({ userId: session.user.id });
  return { session, doctor };
}

export async function GET() {
  try {
    await connectDB();
    const { session, doctor } = await getDoctor();
    if (!session)
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    if (!doctor)
      return NextResponse.json(
        { success: false, message: "Doctor profile not found" },
        { status: 404 },
      );
    return NextResponse.json({ success: true, doctor });
  } catch (error) {
    console.error("Get doctor profile error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

async function saveProfile(req: Request, method: "POST" | "PUT") {
  await connectDB();
  const { session, doctor } = await getDoctor();
  if (!session)
    return NextResponse.json(
      { success: false, message: "Only doctors can manage profiles" },
      { status: 401 },
    );
  if (!doctor)
    return NextResponse.json(
      { success: false, message: "Doctor profile not found" },
      { status: 404 },
    );
  if (doctor.status !== "approved")
    return NextResponse.json(
      { success: false, message: "Your doctor account must be approved first" },
      { status: 403 },
    );

  const parsed = profileSchema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json(
      {
        success: false,
        message: "Please correct the profile fields and try again",
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );

  const update = { ...parsed.data, profileCompleted: true };
  const updated = await Doctor.findOneAndUpdate(
    { userId: session.user.id },
    { $set: update },
    { new: true, runValidators: true },
  );
  return NextResponse.json(
    {
      success: true,
      message:
        method === "POST"
          ? "Profile created successfully"
          : "Profile updated successfully",
      doctor: updated,
    },
    { status: method === "POST" ? 201 : 200 },
  );
}

export async function POST(req: Request) {
  try {
    return await saveProfile(req, "POST");
  } catch (error) {
    console.error("Create doctor profile error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to create profile" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    return await saveProfile(req, "PUT");
  } catch (error) {
    console.error("Update doctor profile error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to update profile" },
      { status: 500 },
    );
  }
}
