import { connectDB } from "../../../../lib/db";
import User from "../../../../lib/models/user";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();

  await connectDB();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response("User already exists", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashedPassword,
    role, // "patient" or "doctor"
  });

  return new Response("User created", { status: 201 });
}
