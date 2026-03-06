// app/api/public/gallery/[token]/route.ts

import { NextResponse } from "next/server";
import dbConnection from "@/lib/mongodb";
import ClientShare from "@/model/ClientShare";
import File from "@/model/File";
import { use } from "react";

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  await dbConnection();
  const { token } = await params;

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