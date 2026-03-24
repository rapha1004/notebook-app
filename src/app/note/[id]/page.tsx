"use client";
import Editor from "@/components/Editor";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

export default function NotePage() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("Note Page");
  const [isLoading, setIsLoading] = useState(true);
  const [editorContent, setEditorContent] = useState("Loading...");
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState(title);

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("discord");
    }
  }, [status]);

  const params = useParams();
  if (!params.id) return null;

  const pageId = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    document.title = "Notebook App - " + title;
  }, [title]);

  useEffect(() => {
    fetch(`/api/note/${pageId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.content) {
          setEditorContent(data.content);
          setTitle(data.title);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log("Error fetching note content:", error);
        setEditorContent("Error loading content");
        setTitle("Error");
        setIsLoading(false);
      });
  }, [pageId]);

  useEffect(() => {
    setNewNoteTitle(title);
  }, [title]);

  const sendUpdateToServer = (data: { title?: string; content?: any }) => {
    if (!pageId) return;
    fetch(`/api/note/${pageId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  return (
    <>
      <div className="ml-64 p-4">
        <h1
          className={`text-2xl flex gap-2 font-bold mb-4 ${isLoading ? "animate-loading" : ""}`}
        >
          {title}
          {!isLoading && (
            <button
              className="cursor-pointer"
              onClick={() => setShowTitleModal(true)}
            >
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                  stroke="#000000"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                  stroke="#000000"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          )}
        </h1>
        <Editor
          isLoading={isLoading}
          content={editorContent}
          setContent={setEditorContent}
          sendUpdateToServer={sendUpdateToServer}
        />
      </div>

      {showTitleModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-80">
            <h2 className="text-lg font-bold mb-4">Change title</h2>
            <input
              type="text"
              placeholder="New page"
              autoFocus
              value={newNoteTitle}
              className="border p-2 w-full mb-4 rounded"
              onChange={(e) => setNewNoteTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendUpdateToServer({ title: newNoteTitle });
                  setShowTitleModal(false);
                  setTitle(newNoteTitle || "New Page");
                }
              }}
            />
            <button
              onClick={() => {
                sendUpdateToServer({ title: newNoteTitle });
                setShowTitleModal(false);
                setTitle(newNoteTitle || "New Page");
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
            >
              Change title
            </button>
          </div>
        </div>
      )}
    </>
  );
}
