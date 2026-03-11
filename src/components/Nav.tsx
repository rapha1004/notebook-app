"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useNote } from "@/context/NoteContext";
import CreationForm from "@/components/CreationForm";

export default function nav() {
  const { data: session } = useSession();
  const { NoteList, setNoteList }: any = useNote();
  const [showCreationForm, setShowCreationForm] = useState(false);

  useEffect(() => {
    if (!session) return;
    fetch("/api/note")
      .then((res) => res.json())
      .then((data) => {
        setNoteList(data.notes || []);
      });
  }, [session]);

  if (!session) return null;
  return (
    <>
        <nav className="fixed left-0 top-0 h-full w-64 bg-background p-4 shadow-md">
      <h1 className="text-xl font-bold mb-8">Notebook App</h1>
      <div className="flex justify-center mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:cursor-pointer"
          onClick={() => setShowCreationForm(true)}
        >
          create doc
        </button>
      </div>
      <hr />
      <ul className="flex flex-col space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollbar-thumb-rounded-full scrollbar-track-rounded-full overflow-y-auto h-[calc(100vh-8rem)]">
        {NoteList?.map((note: any) => (
          <li
            key={note._id}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
          >
            {note.title}
          </li>
        ))}
      </ul>
    </nav>
      {showCreationForm && <CreationForm setShowCreationForm={setShowCreationForm} />}
    </>
  );
}
