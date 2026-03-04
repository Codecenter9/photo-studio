import {  NextResponse } from "next/server";
import dbConnection from "@/lib/mongodb";
import Folder from "@/model/Folder";
import File from "@/model/File";
import cloudinary from "@/lib/cloudinary";
import User from "@/model/User";
import Schedule from "@/model/Schedule";

export async function DELETE(
 req: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    await dbConnection();

    const { id } =await params;

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const files = await File.find({ clientId: id });

    if (files.length > 0) {
      const grouped: Record<string, string[]> = {};

      files.forEach((file) => {
        const type = file.resourceType || "image";
        if (!grouped[type]) grouped[type] = [];
        grouped[type].push(file.publicId);
      });

       for (const type in grouped) {
            if (grouped[type].length > 0) {
              await cloudinary.api.delete_resources(grouped[type], {
                resource_type: type as "image" | "video" | "raw",
              });
            }
          }

      await File.deleteMany({ clientId: id });
    }

    await Folder.deleteMany({ clientId: id });

    await Schedule.deleteMany({ clientId: id });

    await User.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "User and all related data deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { message: "Something went wrong while deleting user" },
      { status: 500 }
    );
  }
}