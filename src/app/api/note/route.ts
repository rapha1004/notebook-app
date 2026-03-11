import { NextRequest, NextResponse } from "next/server";
import Note from "@/models/Note";
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await dbConnect();
    const notes = await Note.find({ userId: session.user.id }).select("_id title").lean();
    return NextResponse.json({ notes }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await dbConnect();
    const { title } = await req.json();

    const note = await Note.create({
      title,
      userId: session.user.id,
    });

    return NextResponse.json({ _id: note._id.toString(), title: note.title }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating note:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
