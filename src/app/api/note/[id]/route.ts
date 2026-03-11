import { NextRequest, NextResponse } from "next/server";
import Note from "@/models/Note";
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";






export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await dbConnect();

    const note = await Note.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    return NextResponse.json({ _id: note._id.toString(), title: note.title }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting note:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
