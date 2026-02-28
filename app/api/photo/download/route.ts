import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { publicIds, zipName ,type} = body;

    if (!Array.isArray(publicIds) || publicIds.length === 0) {
      return NextResponse.json(
        { error: "publicIds must be a non-empty array" },
        { status: 400 }
      );
    }

    const zipUrl = cloudinary.utils.download_zip_url({
      public_ids: publicIds,
      resource_type: type,
      target_public_id: zipName || "media-archive",
      flatten_folders: true,
    });

    return NextResponse.json({ url: zipUrl });

  } catch (error) {
    console.error("Cloudinary ZIP error:", error);

    return NextResponse.json(
      { error: "Failed to generate ZIP" },
      { status: 500 }
    );
  }
}