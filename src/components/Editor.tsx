"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";
import { useParams } from "next/navigation";

type EditorProps = {
  pageId: string;
  className?: string;
};

export default function Editor({ }) {
  const params = useParams();
  if (!params.id) return null;
  const pageId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
    ],
    autofocus: true,
    immediatelyRender: false,
  });

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


useEffect(() => {
  if (!editor) return;

  fetch(`/api/note/${pageId}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.content) {
        editor.commands.setContent(data.content);
      } else {
        editor.commands.setContent("hello");
      }
    })
    .catch((error) => {
      console.error("Error fetching note content:", error);
      editor.commands.setContent("hello");
    });
}, [editor, pageId]);


useEffect(() => {
  if (!editor) return;

  let timeout: NodeJS.Timeout;

  const handler = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      sendUpdateToServer(editor.getJSON());
    }, 4000);
  };

  editor.on("update", handler);

  return () => {
    editor.off("update", handler);
    clearTimeout(timeout);
  };
}, [editor]);


  //auto save
useEffect(() => {
  if (!editor) return;

  const save = () => {
    const savedAll = localStorage.getItem("notes");
    const notes = savedAll ? JSON.parse(savedAll) : {};

    notes[pageId] = editor.getJSON();
    localStorage.setItem("notes", JSON.stringify(notes));
  };

  editor.on("update", save);

  return () => {
    editor.off("update", save);
  };
}, [editor, pageId]);

  if (!editor) return null;

  return (
    <div className={`flex flex-col h-full w-full`}>
      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-2 py-1 border rounded"
        >
          Bold
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="px-2 py-1 border rounded"
        >
          Italic
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className="px-2 py-1 border rounded"
        >
          Strike
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="px-2 py-1 border rounded"
        >
          Underline
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className="px-2 py-1 border rounded"
        >
          Code
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="px-2 py-1 border rounded"
        >
          Bullet List
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="px-2 py-1 border rounded"
        >
          Ordered List
        </button>
        <button
            onClick={() => sendUpdateToServer(editor.getJSON())}
          className="px-2 py-1 border rounded"
        >
          save
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="prose prose-lg min-h-[400px] focus:outline-none flex-1 outline-none p-10 max-w-4xl mx-auto w-full"
      />
    </div>
  );
}
