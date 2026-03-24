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
  const [collapsed, setCollapsed] = useState(false);

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
      <nav
        className={`bg-background p-4 shadow-md
    transition-all duration-300 ease-in-out
    ${collapsed ? "w-16" : "w-64"}
  `}
      >
        <div className="flex items-center justify-between mb-4">
          {!collapsed && (
            <h1 className="text-xl font-bold">
              <Link href="/">Notebook App</Link>
            </h1>
          )}
          <button
            className="cursor-pointer"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 13V10H0L1.74846e-07 6L7 6L7 3L8 3L13 8L8 13H7Z"
                  fill="#000000"
                />
                <path d="M14 14V2L16 2V14H14Z" fill="#000000" />
              </svg>
            ) : (
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 3L6 6H12L12 10H6L6 13L5 13L0 8L5 3L6 3Z"
                  fill="#000000"
                />
                <path d="M16 2L16 14H14L14 2L16 2Z" fill="#000000" />
              </svg>
            )}
          </button>
        </div>

        <div
          className={`transition-opacity duration-300 ${collapsed ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <div className="flex justify-center mb-6">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
        </div>
      </nav>
    </>
  );
}
