"use client";

import { useEffect, useState } from "react";
import { useSession, signOut, signIn } from "next-auth/react";
import CreationForm from "@/components/CreationForm";

export default function Home() {
  const { data: session, status } = useSession();
  const [showCreationForm, setShowCreationForm] = useState(false);

    useEffect(() => {
    document.title = "Notebook App";
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("discord");
    }
  }, [status]);

  if (!session) return null;

  return (
    <>
        <div className="ml-64 p-4 min-h-screen flex flex-col items-center justify-center">
      {session ? (
        <>
          <h1 className="text-2xl font-bold mb-6">
            Welcome {session.user?.name}👋
          </h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:cursor-pointer mb-10"
            onClick={() => signOut()}
          >
            Sign out
          </button>

          <div className="flex flex-col items-center justify-center border border-gray-400 border-dashed p-10 rounded-lg">
            <pre className="text-gray-400 text-6xl mb-6 select-none">
              (＾▽＾)
            </pre>
            <p className="text-gray-500 text-xl font-semibold text-center mb-10">
              Create a new note or open one to get started
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:cursor-pointer"
              onClick={() => setShowCreationForm(true)}
            >
              Create Note
            </button>
          </div>
        </>
      ) : (
        <h1 className="text-xl">Loading...</h1>
      )}

      {showCreationForm && <CreationForm setShowCreationForm={setShowCreationForm} />}
    </div>
    </>
  );
}
