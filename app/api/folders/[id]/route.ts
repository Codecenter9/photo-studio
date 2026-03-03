import {  NextResponse } from "next/server";
import dbConnection from "@/lib/mongodb";
import Folder from "@/model/Folder";
import File from "@/model/File";
import cloudinary from "@/lib/cloudinary";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    await dbConnection();

   const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { message: "Folder ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { message: "Folder name is required" },
        { status: 400 }
      );
    }

    const folder = await Folder.findById(id);

    if (!folder) {
      return NextResponse.json(
        { message: "Folder not found" },
        { status: 404 }
      );
    }

    folder.name = name.trim();
    await folder.save();

    return NextResponse.json(
      { message: "Folder renamed successfully", folder },
      { status: 200 }
    );
  } catch (error) {
    console.error("Rename folder error:", error);
    return NextResponse.json(
      { message: "Something went wrong while renaming folder" },
      { status: 500 }
    );
  }
}

export async function DELETE(
 req: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    await dbConnection();

   const {id} = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Folder ID is required" },
        { status: 400 }
      );
    }

    const folder = await Folder.findById(id);

    if (!folder) {
      return NextResponse.json(
        { message: "Folder not found" },
        { status: 404 }
      );
    }

    const files = await File.find({ id });

    if (files.length > 0) {
      const grouped: Record<string, string[]> = {};

      files.forEach((file) => {
        const type = file.resourceType || "image";
        if (!grouped[type]) grouped[type] = [];
        grouped[type].push(file.publicId);
      });

      for (const type in grouped) {
        await cloudinary.api.delete_resources(grouped[type], {
          resource_type: type,
        });
      }

      await File.deleteMany({ id });
    }

    await Folder.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Folder and its files deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete folder error:", error);
    return NextResponse.json(
      { message: "Something went wrong while deleting folder" },
      { status: 500 }
    );
  }
}