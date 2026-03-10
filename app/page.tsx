"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session, status } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [showCreationForm, setShowCreationForm] = useState(false);

  const handleCreationForm = (title: string) => {
    fetch("/api/note/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
      credentials: "include",
    })
    .then(res => res.json())
    .then(data => {
      console.log("Note created, id:", data._id);
      setShowCreationForm(false);
    })
    .catch(error => {
      console.error("Error creating note:", error);
    });
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      setShowModal(true);
    }
  }, [status]);

  const handleSignIn = () => {
    signIn("discord");
  };

  return (
    <>
      {session && !showModal ? (
        <>
          <h1 className="text-2xl font-bold">
            Bienvenue {session.user?.name} {session.user.id} 👋
          </h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:cursor-pointer" onClick={() => signOut()}>
            Se déconnecter
          </button>

          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:cursor-pointer" onClick={() => setShowCreationForm(true)}>
            create doc
          </button>
        </>
      ) : showModal ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="mt-4 flex justify-end space-x-2">
              <Button onClick={handleSignIn}>Se connecter avec Discord</Button>
            </div>
          </div>
        </div>
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
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => handleCreationForm((document.querySelector('input[placeholder="New page"]') as HTMLInputElement).value || "New page")}>
              create doc
            </button>
          </div>
        </div>
      )}
    </>
  );
}
