interface Note {
  _id: string;
  title: string;
  content?: string;
}

interface NotesResponse {
  notes: Note[];
}

export const noteApi = {
  // Fetch all notes for the current user
  async fetchNotes(): Promise<Note[]> {
    const res = await fetch("/api/note");
    const data: NotesResponse = await res.json();
    return data.notes || [];
  },

  // Create a new note
  async createNote(title: string): Promise<Note> {
    const res = await fetch("/api/note", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });
    const data: Note = await res.json();
    return data;
  },
};
