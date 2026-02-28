import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import dbConnection from "@/lib/mongodb";
import User from "@/model/User";

export async function GET() {
  try {
    await dbConnection(); 

    const users = await User.find()
      .select("-password") 
      .lean()
      .sort({ createdAt: -1 }); 

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Users Error:", error);
    return NextResponse.json(
      { message: "Failed to load users" },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  try {
    const { name, email,phone, password,role } = await req.json();

    const errors: Record<string, string> = {};

    if (!name) errors.name = "Name is required";
    if (!email) errors.email = "Email is required";
    if (!phone) errors.phone = "Phone is required";
    if (!password) errors.password = "Password is required";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors,
        },
        { status: 400 }
      );
    }

    await dbConnection();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: {
            email: "Email already registered",
          },
        },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role:role,
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register Error:", error);

    return NextResponse.json(
      {
        message: "Server error. Please try again.",
      },
      { status: 500 }
    );
  }
}
