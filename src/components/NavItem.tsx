"use client";

import { useNote } from "@/context/NoteContext";
import { useRouter, useParams } from "next/navigation";
import { useRef, useState } from "react";
import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function NavItem({ id, title }: { id: string; title: string }) {
  const {
    NoteList,
    setNoteList,
  }: {
    NoteList: { _id: string; title: string }[];
    setNoteList: React.Dispatch<
      React.SetStateAction<{ _id: string; title: string }[]>
    >;
  } = useNote();
  const router = useRouter();
  const { id: currentId } = useParams();
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  // Only the grip handle starts a drag, so the link and delete button
  // behave exactly as before.
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = () => {
    setDeleting(true);
    fetch(`/api/note/${id}`, {
      method: "DELETE",
    }).then(() => {
      setNoteList(
        NoteList.filter(
          (note: { _id: string; title: string }) => note._id !== id,
        ),
      );
      if (currentId === id) {
        router.push("/");
      }
    });
  };

  const startRename = () => {
    setDraft(title);
    setEditing(true);
    // Focus after the input has rendered.
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const cancelRename = () => {
    setEditing(false);
    setDraft(title);
  };

  const saveRename = () => {
    const nextTitle = draft.trim();
    setEditing(false);
    if (!nextTitle || nextTitle === title) {
      setDraft(title);
      return;
    }
    // Optimistic update of the sidebar.
    setNoteList(
      NoteList.map((note: { _id: string; title: string }) =>
        note._id === id ? { ...note, title: nextTitle } : note,
      ),
    );
    fetch(`/api/note/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: nextTitle }),
    }).then((res) => {
      if (!res.ok) {
        // Roll back if the rename failed.
        setNoteList(
          NoteList.map((note: { _id: string; title: string }) =>
            note._id === id ? { ...note, title } : note,
          ),
        );
      }
    });
  };

  return (
    <>
      <li
        ref={setNodeRef}
        style={style}
        className={`p-2 bg-gray-200 rounded mb-0 hover:bg-gray-300 cursor-pointer flex items-center justify-between ${deleting ? "animate-loading" : ""} ${isDragging ? "relative z-10 shadow-md opacity-80" : ""}`}
      >
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={`Reorder ${title}`}
          className="cursor-grab active:cursor-grabbing touch-none mr-2 p-1 rounded text-gray-500 hover:bg-gray-400/40"
        >
          <svg
            width="12px"
            height="20px"
            viewBox="0 0 12 20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="3" cy="4" r="1.5" />
            <circle cx="9" cy="4" r="1.5" />
            <circle cx="3" cy="10" r="1.5" />
            <circle cx="9" cy="10" r="1.5" />
            <circle cx="3" cy="16" r="1.5" />
            <circle cx="9" cy="16" r="1.5" />
          </svg>
        </button>
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            value={draft}
            aria-label={`Rename ${title}`}
            className="flex-1 bg-white rounded px-1 py-0.5 outline-none border border-blue-400 min-w-0"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveRename();
              if (e.key === "Escape") cancelRename();
            }}
            onBlur={saveRename}
          />
        ) : (
          <Link href={`/note/${id}`} className="flex-1 truncate">
            {title}
          </Link>
        )}
        {!editing && (
          <button
            onClick={startRename}
            aria-label={`Rename ${title}`}
            className="cursor-pointer ml-2 p-1 rounded hover:bg-blue-500 hover:text-white"
          >
            <svg
              width="18px"
              height="18px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        <button
          onClick={handleDelete}
          aria-label={`Delete ${title}`}
          className="cursor-pointer ml-2 p-1 rounded hover:bg-red-500 hover:text-white"
        >
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17"
              stroke="currentColor"
            />
          </svg>
        </button>
      </li>
    </>
  );
}
