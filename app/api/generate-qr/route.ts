// app/api/client/generate-qr/route.ts

import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnection from "@/lib/mongodb";
import ClientShare from "@/model/ClientShare";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST() {
  await dbConnection();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = crypto.randomBytes(16).toString("hex");

  const share = await ClientShare.create({
    clientId: session.user.id,
    token,
  });

  return NextResponse.json({
    token,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/gallery/${token}`,
  });
}