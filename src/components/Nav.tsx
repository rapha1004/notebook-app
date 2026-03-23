"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useNote } from "@/context/NoteContext";
import Link from "next/link";
import CreationForm from "@/components/CreationForm";
import NavItem from "@/components/NavItem";

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


  return (
    <>
        <nav className="fixed left-0 top-0 h-full w-64 bg-background p-4 shadow-md">
      <h1 className="text-xl font-bold mb-4"><Link href="/">Notebook App</Link></h1>
      <div className="flex justify-center mb-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:cursor-pointer"
          onClick={() => setShowCreationForm(true)}
        >
          Create Note
        </button>
      </div>
      <hr className="mb-4" />
      <ul className="flex flex-col space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 gap-4 scrollbar-thumb-rounded-full scrollbar-track-rounded-full overflow-y-auto h-[calc(100vh-8rem)] p-2 pt-0">
        {NoteList?.map((note: any) => (
          <NavItem key={note._id} id={note._id} title={note.title} />
        ))}
      </ul>
    </nav>
      {showCreationForm && <CreationForm setShowCreationForm={setShowCreationForm} />}
    </>
  );
}
