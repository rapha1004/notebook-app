"use client";
import Editor from "@/components/Editor";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function NotePage() {
  const [title, setTitle] = useState("Note Page");
  const [isLoading, setIsLoading] = useState(true);
  const [editorContent, setEditorContent] = useState("Loading...");

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

  const sendUpdateToServer = (content: any) => {
    if (!pageId) return;
    fetch(`/api/note/${pageId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
  };
  return (
    <div className="ml-64 p-4">
      <h1
        className={`text-2xl font-bold mb-4 ${isLoading ? "animate-loading" : ""}`}
      >
        {title}
      </h1>
      <Editor
        isLoading={isLoading}
        content={editorContent}
        setContent={setEditorContent}
        sendUpdateToServer={sendUpdateToServer}
      />
    </div>
  );
}
