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
      {collapsed && (
          <button className="absolute p-5" onClick={() => setCollapsed(false)}>
            <svg
              width="21px"
              height="21px"
              viewBox="0 0 32 32"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>arrow-left-circle</title>
              <desc>Created with Sketch Beta.</desc>
              <defs></defs>
              <g
                id="Page-1"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd"
              >
                <g
                  id="Icon-Set-Filled"
                  transform="translate(-258.000000, -1089.000000)"
                  fill="#000000"
                >
                  <path
                    d="M281,1106 L270.414,1106 L274.536,1110.12 C274.926,1110.51 274.926,1111.15 274.536,1111.54 C274.145,1111.93 273.512,1111.93 273.121,1111.54 L267.464,1105.88 C267.225,1105.64 267.15,1105.31 267.205,1105 C267.15,1104.69 267.225,1104.36 267.464,1104.12 L273.121,1098.46 C273.512,1098.07 274.145,1098.07 274.536,1098.46 C274.926,1098.86 274.926,1099.49 274.536,1099.88 L270.414,1104 L281,1104 C281.552,1104 282,1104.45 282,1105 C282,1105.55 281.552,1106 281,1106 L281,1106 Z M274,1089 C265.164,1089 258,1096.16 258,1105 C258,1113.84 265.164,1121 274,1121 C282.836,1121 290,1113.84 290,1105 C290,1096.16 282.836,1089 274,1089 L274,1089 Z"
                    id="arrow-left-circle"
                  ></path>
                </g>
              </g>
            </svg>
          </button>
      )}
      <nav
        className={`bg-background p-4 shadow-md bg-white z-50
    transition-all duration-300 ease-in-out max-sm:absolute 
    ${collapsed ? "w-16 max-sm:p-0 max-sm:w-0" : "w-64"}
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
                className="max-sm:hidden"
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
              className="bg-blue-500 text-white px-4 py-2 cursor-pointer rounded hover:bg-blue-600"
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
      {showCreationForm && (
        <CreationForm setShowCreationForm={setShowCreationForm} />
      )}
    </>
  );
}
