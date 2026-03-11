"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useNote } from "@/context/NoteContext";

export default function Home() {
  const { data: session, status } = useSession();
  const [showCreationForm, setShowCreationForm] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const { NoteList, setNoteList } = useNote();

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
      })
      .catch((error) => {
        console.error("Error creating note:", error);
      });
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  if (!session) return null;

  return (
    <div className="ml-64 p-4">
      {session ? (
        <>
          <h1 className="text-2xl font-bold">
            Bienvenue {session.user?.name}👋
          </h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:cursor-pointer"
            onClick={() => signOut()}
          >
            Se déconnecter
          </button>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:cursor-pointer"
            onClick={() => setShowCreationForm(true)}
          >
            create doc
          </button>
        </>
      ) : (
        <h1 className="text-xl">chargement...</h1>
      )}
      {/* creation form*/}
      {showCreationForm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
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
      )}
    </div>
  );
}
