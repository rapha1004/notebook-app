import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },

  title: {
    type: String,
    default: "New page",
    set: (v: string) => (v && v.trim() !== "" ? v : "New page")
  },

  content: {
    type: Object,
    required: true,
    default: {
      type: "doc",
      content: [
        { type: "heading", content: [{ type: "text", text: "👋 Hello world!" }] }
      ]
    }
  },

  // Manual position among the note's siblings (same user; later same parent).
  // Absent on notes created before manual ordering existed.
  order: {
    type: Number
  },

}, {
  timestamps: true
});

// Supports the sidebar query: a user's notes by manual order.
NoteSchema.index({ userId: 1, order: 1 });

export default mongoose.models.Note || mongoose.model("Note", NoteSchema, "Notes");