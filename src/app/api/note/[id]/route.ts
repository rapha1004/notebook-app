import { NextRequest, NextResponse } from "next/server";
import Note from "@/models/Note";
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export const GET = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = context.params;

  try {
    await dbConnect();

    const note = await Note.findOne({ _id: id, userId: session.user.id });
    if (!note)
      return NextResponse.json({ error: "Note not found" }, { status: 404 });

    return NextResponse.json({
      _id: note._id.toString(),
      title: note.title,
      content: note.content,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = context.params;

  try {
    await dbConnect();
    const { content } = await req.json();

    const note = await Note.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { content },
      { new: true }
    );

    if (!note)
      return NextResponse.json({ error: "Note not found" }, { status: 404 });

    return NextResponse.json({
      _id: note._id.toString(),
      title: note.title,
      content: note.content,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  context: { params: { id: string } }
) => {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = context.params;

  try {
    await dbConnect();

    const note = await Note.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!note)
      return NextResponse.json({ error: "Note not found" }, { status: 404 });

    return NextResponse.json({
      _id: note._id.toString(),
      title: note.title,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};