"use client";
import Editor from "@/components/Editor";
import { useState } from "react";

export default function NotePage() {
    const [ title, setTitle ] = useState("Note Page");
    const [ isLoading, setIsLoading ] = useState(true);

  return (
    <div className="ml-64 p-4">
      <h1 className={`text-2xl font-bold mb-4 ${isLoading ? 'animate-loading' : ''}`}>{title}</h1>
      <Editor setTitle={setTitle} isLoading={isLoading} setIsLoading={setIsLoading} />
    </div>
  );
}