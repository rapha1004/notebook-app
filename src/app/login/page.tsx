"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function login() {
  const { data: session, status } = useSession();
  const { push } = useRouter();


  useEffect(() => {
    if (status === "authenticated") {
      push("/");
    }
  }, [status]);

  
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const handleSignIn = () => {
    signIn("discord");
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={handleSignIn}>Se connecter avec Discord</button>
        </div>
      </div>
    </div>
  );
}
