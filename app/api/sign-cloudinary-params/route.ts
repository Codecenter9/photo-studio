import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const signature = cloudinary.utils.api_sign_request(
    body.paramsToSign,
    process.env.CLOUDINARY_API_SECRET as string
  );

  return NextResponse.json({ signature });
}