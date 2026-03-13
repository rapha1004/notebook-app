"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";

type Props = {
  isLoading: boolean;
  content: any;
  setContent: (content: any) => void;
  sendUpdateToServer: (content: any) => void;
};

export default function Editor({
  isLoading,
  content,
  setContent,
  sendUpdateToServer,
}: Props) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: content,
    autofocus: true,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setContent(editor.getJSON());
    },
  });

  useEffect(() => {
    if (!editor) return;

    let timeout: NodeJS.Timeout;

    const handler = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        sendUpdateToServer(editor.getJSON());
      }, 2000);
    };

    editor.on("update", handler);

    return () => {
      editor.off("update", handler);
      clearTimeout(timeout);
    };
  }, [editor]);

  useEffect(() => {
    if (!editor || !content) return;

    const current = editor.getJSON();

    if (JSON.stringify(current) !== JSON.stringify(content)) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);
  
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
          onClick={() =>
            (editor as any).chain().focus().toggleUnderline().run()
          }
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
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className={`prose prose-lg min-h-100 focus:outline-none flex-1 outline-none p-10 max-w-4xl mx-auto w-full
  [&_ul]:list-disc [&_ul]:ml-6
  [&_ol]:list-decimal [&_ol]:ml-6 ${isLoading ? "animate-loading" : ""}`}
      />
    </div>
  );
}
