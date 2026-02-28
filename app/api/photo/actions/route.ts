import dbConnection from "@/lib/mongodb";
import File from "@/model/File";
import cloudinary from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  await dbConnection();

  const { action, photoIds, data } = await req.json();

  if (!photoIds || !Array.isArray(photoIds)) {
    return NextResponse.json(
      { message: "Invalid photo IDs" },
      { status: 400 }
    );
  }

  switch (action) {

    case "update":
      await File.updateMany(
        { publicId: { $in: photoIds } },
        { $set: data }
      );
      break;

    case "delete":

      const files = await File.find({
        publicId: { $in: photoIds }
      });

      const grouped: Record<string, string[]> = {};

      files.forEach(file => {
        const type = file.resourceType || "image";
        if (!grouped[type]) grouped[type] = [];
        grouped[type].push(file.publicId);
      });

      for (const type in grouped) {
        await cloudinary.api.delete_resources(grouped[type], {
          resource_type: type
        });
      }

      await File.deleteMany({
        publicId: { $in: photoIds }
      });

      break;

    default:
      return NextResponse.json(
        { message: "Invalid action type" },
        { status: 400 }
      );
  }

  return NextResponse.json({ message: "Bulk action completed" });
}