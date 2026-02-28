import { NextResponse } from "next/server";
import dbConnection from "@/lib/mongodb";
import Photo from "@/model/File";

export async function GET(req: Request) {
  try {
    await dbConnection();

    const url = new URL(req.url);
    const folderId = url.searchParams.get("folderId"); 
    const clientId = url.searchParams.get("clientId"); 

    const query: any = {};
    if (folderId) query.folderId = folderId;
    if (clientId) query.clientId = clientId;

    const photos = await Photo.find(query).sort({ createdAt: -1 }); 

    return NextResponse.json(photos);
  } catch (err) {
    console.error("Get photos error:", err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    await dbConnection();
    const body = await req.json();
    console.log("Received photo data:", body);

    const photo = await Photo.create(body);

    return NextResponse.json(photo);
  } catch (err) {
    console.error("Create photo error:", err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

