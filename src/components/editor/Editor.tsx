"use client";

import {useEditor, EditorContent, type Editor as TiptapEditor, } from "@tiptap/react";
import Emoji, { gitHubEmojis } from "@tiptap/extension-emoji";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle, Color } from "@tiptap/extension-text-style";
import { Markdown } from "@tiptap/markdown";
import { Table, TableRow, TableHeader, TableCell } from "@tiptap/extension-table";
import { useEffect, useRef } from "react";
import suggestion from "../suggestion";
import Tools from "./Tools";
import { looksLikeMarkdown } from "./markdownPaste";

type Props = {
  isLoading: boolean;
  content: object;
  setContent: (content: object) => void;
  sendUpdateToServer: (data: object) => void;
};

export default function Editor({
  isLoading,
  content,
  setContent,
  sendUpdateToServer,
}: Props) {
  const editorRef = useRef<TiptapEditor | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Emoji.configure({
        emojis: gitHubEmojis,
        enableEmoticons: true,
        suggestion,
      }),
      Markdown,
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    editorProps: {
      // Render pasted Markdown (plain-text clipboard only) as rich content.
      // Returning false falls back to Tiptap's default paste handling.
      handlePaste: (view, event) => {
        const currentEditor = editorRef.current;
        const clipboard = event.clipboardData;
        if (!currentEditor || !clipboard) return false;
        // Rich (HTML) pastes are already handled by the default behavior.
        if (clipboard.types.includes("text/html")) return false;
        // Inside a code block, keep the raw text.
        if (view.state.selection.$from.parent.type.spec.code) return false;

        const text = clipboard.getData("text/plain");
        if (!text || !looksLikeMarkdown(text)) return false;

        return currentEditor.commands.insertContent(text, {
          contentType: "markdown",
        });
      },
    },
    content: content,
    autofocus: true,
    immediatelyRender: false,
    onUpdate: ({ editor }: { editor: TiptapEditor }) => {
      setContent(editor.getJSON());
    },
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  Color.configure({
    types: ["textStyle"],
  });

  useEffect(() => {
    if (!editor) return;

    let timeout: NodeJS.Timeout;

    const handler = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        sendUpdateToServer({ content: editor.getJSON() });
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
    <div className="flex flex-col h-full w-full">
      <Tools editor={editor} />
      <hr />
      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <EditorContent
          editor={editor}
          className={`prose prose-lg min-h-100 focus:outline-none flex-1 outline-none p-10 max-w-4xl mx-auto w-full
  [&_ul]:list-disc [&_ul]:ml-6
  [&_ol]:list-decimal [&_ol]:ml-6 ${isLoading ? "animate-loading" : ""}`}
        />
      </div>
    </div>
  );
}
