import { useNote } from "@/context/NoteContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreationForm({setShowCreationForm}: any) {
    const [newNoteTitle, setNewNoteTitle] = useState("");
    const { NoteList, setNoteList }: any = useNote();
    const router = useRouter();

      const handleCreationForm = (title: string) => {
        console.log(title);
    
        fetch("/api/note", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Note created, id:", data);
            setNoteList(prev => [...prev, data]);
            setShowCreationForm(false);
            router.push(`/note/${data._id}`);
          })
          .catch((error) => {
            console.error("Error creating note:", error);
          });
      };

    return (
        <>
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-80">
            <h2 className="text-lg font-bold mb-4">Créer une note</h2>
            <input
              type="text"
              placeholder="New page"
              className="border p-2 w-full mb-4 rounded"
              onChange={(e) => setNewNoteTitle(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => handleCreationForm(newNoteTitle || "New page")}
            >
              create doc
            </button>
          </div>
        </div>
        </>
    )
}