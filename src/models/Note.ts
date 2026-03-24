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


}, {
  timestamps: true
});

export default mongoose.models.Note || mongoose.model("Note", NoteSchema, "Notes");