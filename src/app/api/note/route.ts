import { NextRequest, NextResponse } from "next/server";
import Note from "@/models/Note";
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { siblingGroupFilter, sortNotes } from "@/lib/noteOrder";

type NoteListRow = { _id: string; title: string; order?: number; createdAt?: Date };

export const GET = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await dbConnect();
    // Sorted in memory: ordered notes first, then legacy notes without an
    // `order` (see sortNotes). MongoDB would put missing values first.
    const rows = await Note.find(siblingGroupFilter(session.user.id))
      .select("_id title order createdAt")
      .lean<NoteListRow[]>();
    const notes = sortNotes(rows).map(({ _id, title }) => ({ _id, title }));
    return NextResponse.json({ notes }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await dbConnect();
    const { title } = await req.json();

    // New notes go to the END of their sibling group.
    const filter = siblingGroupFilter(session.user.id);
    const rows = sortNotes(
      await Note.find(filter).select("_id order createdAt").lean<NoteListRow[]>(),
    );
    let maxOrder = -1;
    for (const n of rows) if (typeof n.order === "number") maxOrder = Math.max(maxOrder, n.order);

    // Legacy notes (no `order`) are displayed after ordered ones; give them
    // explicit positions now, in that same displayed order, so the new note
    // really lands last. Only notes still missing `order` are written.
    const legacy = rows.filter((n) => typeof n.order !== "number");
    if (legacy.length > 0) {
      await Note.bulkWrite(
        legacy.map((n) => ({
          updateOne: {
            filter: { _id: n._id, ...filter, order: { $not: { $type: "number" } } },
            update: { $set: { order: ++maxOrder } },
          },
        })),
        { ordered: false },
      );
    }

    const note = await Note.create({
      title,
      userId: session.user.id,
      order: maxOrder + 1,
    });

    return NextResponse.json({ _id: note._id.toString(), title: note.title }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating note:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
};
