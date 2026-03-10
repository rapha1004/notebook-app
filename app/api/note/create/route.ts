import { NextResponse } from "next/server";
import Note from "@/models/Note";
import dbConnect from "@/lib/mongodb";

export const POST = async (req: Request) => {
    try {
    await dbConnect();       
  const { title } = await req.json();

  const note = await Note.create({
    title: title,
    userId: "123",
  });

  return NextResponse.json({ _id: note._id.toString() }, { status: 201 });
}catch (error: any) {
    console.error("Error creating note:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};