import { NextRequest, NextResponse } from "next/server";
import Note from "@/models/Note";
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { parseReorderIds, siblingGroupFilter } from "@/lib/noteOrder";

// PUT /api/note/reorder
// Body: { ids: string[] } — the complete, ordered list of note ids of one
// sibling group (today: all of the session user's notes).
// Each note gets `order` = its index in the array.
export const PUT = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = parseReorderIds(body);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { ids } = parsed;

  try {
    await dbConnect();
    const filter = siblingGroupFilter(session.user.id);
    const group = await Note.find(filter).select("_id").lean<{ _id: unknown }[]>();
    const groupIds = new Set(group.map((n) => String(n._id)));

    // Never touch notes outside the user's sibling group.
    if (!ids.every((id) => groupIds.has(id))) {
      return NextResponse.json({ error: "Unknown note id" }, { status: 400 });
    }
    // The list must cover the whole group, otherwise positions would collide
    // with notes the client does not know about (e.g. created in another tab).
    if (ids.length !== groupIds.size) {
      return NextResponse.json(
        { error: "ids must list every note of the group; refresh and retry" },
        { status: 409 },
      );
    }

    await Note.bulkWrite(
      ids.map((id, index) => ({
        updateOne: {
          filter: { _id: id, ...filter },
          update: { $set: { order: index } },
        },
      })),
      { ordered: false },
    );

    return NextResponse.json({ ids }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error reordering notes:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
};
