import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/mongodb";
import ClientShare from "@/model/ClientShare";
import File from "@/model/File";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  await dbConnection();

  const { token } = await context.params;

  const share = await ClientShare.findOne({
    token: token,
    active: true,
  });

  if (!share) {
    return NextResponse.json(
      { error: "Invalid QR code" },
      { status: 404 }
    );
  }

  const images = await File.find({
    clientId: share.clientId,
    isPublic: true,
  });

  return NextResponse.json({ images });
}