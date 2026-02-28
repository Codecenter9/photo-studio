import dbConnection from "@/lib/mongodb";
import Schedule from "@/model/Schedule";
import User from "@/model/User";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnection();

    const schedules = await Schedule.find()
      .populate("clientId") 
      .sort({ createdAt: -1 });

    return NextResponse.json({ schedules }, { status: 200 });
  } catch (error) {
    console.error("Get Schedules Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  try {
  
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnection();

    const body = await req.json();
    const { clientId, name, phone, scheduleType, notes } = body;

    const errors: Record<string, string> = {};

    if (!scheduleType) {
      errors.scheduleType = "Schedule type is required";
    }

    if (!clientId && (!name || !phone)) {
      if (!name) errors.name = "Client name is required";
      if (!phone) errors.phone = "Phone number is required";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    let client;

    if (clientId) {
      client = await User.findById(clientId);

      if (!client) {
        return NextResponse.json(
          { message: "Client not found" },
          { status: 404 }
        );
      }
    } else {
      const existingUser = await User.findOne({ phone });

      if (existingUser) {
        client = existingUser;
      } else {
        const randomNumber = Math.floor(Math.random() * 10000);
        const safeName = name.replace(/\s+/g, "").toLowerCase();
        const generatedEmail = `${safeName}${randomNumber}@client.com`;

        const hashedPassword = await bcrypt.hash("1234", 10);

        client = await User.create({
          name,
          phone,
          email: generatedEmail,
          password: hashedPassword,
          role: "client",
        });
        console.log("client",client);
      }
    }

    const newSchedule = await Schedule.create({
      clientId: client._id, 
      scheduleType,
      eventDate: new Date(),
      photographerId: currentUser.id,
      notes,
    });

    return NextResponse.json(
      {
        message: "Schedule created successfully",
        schedule: newSchedule,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Schedule Creation Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}