import { NextResponse } from "next/server";
import dbConnection from "@/lib/mongodb";
import Setting from "@/model/Setting";

export async function GET() {
  await dbConnection();

  let settings = await Setting.findOne();

  if (!settings) {
    settings = await Setting.create({});
  }

  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  await dbConnection();

  const body = await req.json();

  const settings = await Setting.findOneAndUpdate(
    {},
    body,
    { new: true, upsert: true }
  );

  return NextResponse.json(settings);
}