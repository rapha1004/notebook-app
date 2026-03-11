"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useNote } from "@/context/NoteContext";
import CreationForm from "@/components/CreationForm";

export default function Home() {
  const { data: session, status } = useSession();
  const { NoteList, setNoteList } = useNote();

  const router = useRouter();



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


        </>
      ) : (
        <h1 className="text-xl">chargement...</h1>
      )}

    </div>
  );
}
