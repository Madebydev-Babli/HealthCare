import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { v2 as cloudinary } from "cloudinary";

import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Doctor from "@/lib/models/doctor";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxBytes = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "doctor")
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    const doctor = await Doctor.findOne({ userId: session.user.id }).select(
      "status",
    );
    if (!doctor)
      return NextResponse.json(
        { success: false, message: "Doctor profile not found" },
        { status: 404 },
      );
    if (doctor.status !== "approved")
      return NextResponse.json(
        {
          success: false,
          message: "Your doctor account must be approved first",
        },
        { status: 403 },
      );

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File))
      return NextResponse.json(
        { success: false, message: "An image file is required" },
        { status: 400 },
      );
    if (!allowedTypes.has(file.type))
      return NextResponse.json(
        {
          success: false,
          message: "Only JPG, PNG, and WebP images are allowed",
        },
        { status: 400 },
      );
    if (file.size > maxBytes)
      return NextResponse.json(
        { success: false, message: "Image must be 5 MB or smaller" },
        { status: 400 },
      );

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "carebridge-doctors" },
          (error, uploadResult) => {
            if (error || !uploadResult)
              reject(error || new Error("Cloudinary upload failed"));
            else
              resolve({
                secure_url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
              });
          },
        );
        stream.end(buffer);
      },
    );
    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Doctor image upload error:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 },
    );
  }
}
