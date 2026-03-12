import Editor from "@/components/Editor";

export default function NotePage() {
  return (
    <div className="ml-64 p-4">
      <h1 className="text-2xl font-bold mb-4">Note Page</h1>
      <p>This is the note page content.</p>
      <Editor />
    </div>
  );
}