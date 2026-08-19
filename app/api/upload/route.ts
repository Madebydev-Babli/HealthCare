import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const file = body.image;

    const uploadedImage = await cloudinary.uploader.upload(file, {
      folder: "carebridge-doctors",
    });

    return NextResponse.json({
      imageUrl: uploadedImage.secure_url,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Upload failed",
      },
      {
        status: 500,
      },
    );
  }
}
