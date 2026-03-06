import { NextResponse } from "next/server";
import dbConnection from "@/lib/mongodb";
import Photo from "@/model/File";
export async function GET(req: Request,
  { params }: { params: Promise<{ id: string }> } ) {
  try {
    await dbConnection();
    const { id } = await params;

    const photos = await Photo.find({clientId: id, status:"Edited", isPublic:true}).sort({ createdAt: -1 }); 

    return NextResponse.json({photos});
  } catch (err) {
    console.error("Get photos error:", err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}