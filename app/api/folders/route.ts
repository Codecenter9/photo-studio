import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/mongodb";
import Folder from "@/model/Folder";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET(request: NextRequest) {
  try {
    await dbConnection();
    
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");
    const status = searchParams.get("status");

    if (!clientId || !status) {
      return NextResponse.json(
        { message: "clientId and status are required" },
        { status: 400 }
      );
    }

    const folders = await Folder.find({ clientId, status });

    return NextResponse.json(folders);
  } catch (error) {
    console.error("Get folders error:", error);
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnection();

   const user = await getCurrentUser();

  if (!user) return NextResponse.json(
    { message: "Unauthorized" },
    { status: 401 }
  );


    const { name, clientId,status } = await req.json();

    if (!name) {
      return NextResponse.json(
        { message: "Folder name is required" },
        { status: 400 }
      );
    }

    if (!clientId) {
      return NextResponse.json(
        { message: "Client is required" },
        { status: 400 }
      );
    }

    const folder = await Folder.create({
      name,
      clientId,
      createdBy: user.id,
      status,
    });
console.log("created folder:", folder)
    return NextResponse.json(folder, { status: 201 });
  } catch (error) {
    console.error("Create folder error:", error);
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}