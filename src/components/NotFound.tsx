"use client";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="p-4 min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center border border-gray-400 border-dashed p-10 rounded-lg">
        <pre className="text-gray-400 text-6xl mb-6 select-none">(×﹏×)</pre>

        <p className="text-gray-500 text-xl font-semibold text-center mb-10">
          This note doesn’t exist or has been removed
        </p>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 hover:cursor-pointer"
          onClick={() => router.push("/")}
        >
          Go back home
        </button>
      </div>
    </div>
  );
}
