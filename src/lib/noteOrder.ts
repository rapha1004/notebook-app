import mongoose from "mongoose";

// Manual page ordering helpers.
//
// Order is stored per note as an integer `order` and is meaningful only
// inside a "sibling group": the notes of one user that share the same parent.
// There is no `parentId` yet, so today a user's sibling group is all of their
// notes. When nested pages land, only `siblingGroupFilter` (and the callers
// passing a parent) need to change; the stored field and the reorder API stay
// the same.

export type OrderedNoteLike = {
  _id: mongoose.Types.ObjectId | string;
  order?: number | null;
  createdAt?: Date | string | null;
};

/** Mongo filter selecting one sibling group of a user's notes. */
export const siblingGroupFilter = (userId: string) => ({ userId });

const hasOrder = (n: OrderedNoteLike) =>
  typeof n.order === "number" && Number.isFinite(n.order);

const time = (d: OrderedNoteLike["createdAt"]) =>
  d ? new Date(d).getTime() : 0;

/**
 * Sidebar comparator: notes with an `order` first (ascending), then legacy
 * notes without one (createdAt ascending). `_id` is the final tiebreaker so
 * the result is always deterministic.
 */
export const compareNotes = (a: OrderedNoteLike, b: OrderedNoteLike) => {
  const ao = hasOrder(a);
  const bo = hasOrder(b);
  if (ao !== bo) return ao ? -1 : 1;
  if (ao && bo && a.order !== b.order) return (a.order as number) - (b.order as number);
  const t = time(a.createdAt) - time(b.createdAt);
  if (t !== 0) return t;
  const ai = String(a._id);
  const bi = String(b._id);
  return ai < bi ? -1 : ai > bi ? 1 : 0;
};

export const sortNotes = <T extends OrderedNoteLike>(notes: T[]) =>
  [...notes].sort(compareNotes);

/**
 * Validates a reorder payload. Returns the list of ids, or an error message.
 */
export const parseReorderIds = (
  body: unknown,
): { ids: string[] } | { error: string } => {
  if (!body || typeof body !== "object" || !Array.isArray((body as { ids?: unknown }).ids)) {
    return { error: "Body must be { ids: string[] }" };
  }
  const ids = (body as { ids: unknown[] }).ids;
  if (ids.length === 0) return { error: "ids must not be empty" };
  if (!ids.every((id) => typeof id === "string" && mongoose.Types.ObjectId.isValid(id))) {
    return { error: "ids must be valid note ids" };
  }
  if (new Set(ids).size !== ids.length) return { error: "ids must not contain duplicates" };
  return { ids: ids as string[] };
};
