"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle, Color } from "@tiptap/extension-text-style";
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
    extensions: [StarterKit, Underline, TextStyle, Color],
    content: content,
    autofocus: true,
    immediatelyRender: false,
    onUpdate: ({ editor }: { editor: any }) => {
      setContent(editor.getJSON());
    },
  });

  Color.configure({
    types: ["textStyle"],
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
      <ul className="border-b p-2 flex items-center gap-2 list-none m-0">
        <li className="flex items-center" title="we">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
          >
            <strong>B</strong>
          </button>
        </li>
        <li className="flex items-center">
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
          >
            <i>I</i>
          </button>
        </li>
        <li className="flex items-center">
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className="px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
          >
            <s>S</s>
          </button>
        </li>
        <li className="flex items-center">
          <button
            onClick={() =>
              (editor as any).chain().focus().toggleUnderline().run()
            }
            className="px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
          >
            <u>U</u>
          </button>
        </li>
        <li className="flex items-center">
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className="px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
          >
            {"</>"}
          </button>
        </li>
        <li className="flex flex-col items-center cursor-pointer px-2 py-1 hover:bg-gray-100 rounded">
          <label htmlFor="colorInput" className="cursor-pointer">
            A
          </label>
          <input
            id="colorInput"
            type="color"
            onClick={(e: React.MouseEvent<HTMLInputElement>) => editor.commands.setColor((e.target as HTMLInputElement).value)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => editor.commands.setColor(e.target.value)}
            className="w-6 h-1 p-0 border-0"
          />
        </li>

        <li className="flex items-center border-l border-gray-200 h-5 mx-2" />

        <li className="flex items-center">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <circle cx="2" cy="3" r="1.5" />
              <rect x="5" y="2.25" width="9" height="1.5" rx="0.25" />

              <circle cx="2" cy="8" r="1.5" />
              <rect x="5" y="7.25" width="9" height="1.5" rx="0.25" />

              <circle cx="2" cy="13" r="1.5" />
              <rect x="5" y="12.25" width="9" height="1.5" rx="0.25" />
            </svg>
          </button>
        </li>
        <li className="flex items-center">
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <text
                x="0"
                y="3.5"
                fontSize="6"
                fontFamily="Arial"
                fontWeight="bold"
                textAnchor="start"
                dominantBaseline="middle"
              >
                1
              </text>
              <rect x="6" y="2" width="10" height="1.5" rx="0.25" />

              <text
                x="0"
                y="8"
                fontSize="6"
                fontFamily="Arial"
                fontWeight="bold"
                textAnchor="start"
                dominantBaseline="middle"
              >
                2
              </text>
              <rect x="6" y="6.5" width="10" height="1.5" rx="0.25" />

              <text
                x="0"
                y="13.5"
                fontSize="6"
                fontFamily="Arial"
                fontWeight="bold"
                textAnchor="start"
                dominantBaseline="middle"
              >
                3
              </text>
              <rect x="6" y="12" width="10" height="1.5" rx="0.25" />
            </svg>
          </button>
        </li>
      </ul>
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
