
import dbConnection from "@/lib/mongodb";
import Schedule from "@/model/Schedule";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  await dbConnection();

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing schedule ID" }, { status: 400 });
  }

  try {
    const data = await req.json(); 

    const updatedSchedule = await Schedule.findByIdAndUpdate(id, data, { new: true });

    if (!updatedSchedule) {
      return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, schedule: updatedSchedule });
  } catch (error) {
    console.error("Schedule Update Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
