"use client"

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { data: session, status } = useSession()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      // don't redirect immediately, instead show a modal
      setShowModal(true)
    }
  }, [status])

  const handleSignIn = () => {
    signIn("discord")
  }

  const handleClose = () => {
    setShowModal(false)
  }

  return (
    <>
      {session && !showModal ? (
        <>
          <h1 className="text-2xl font-bold">Bienvenue {session.user?.name} 👋</h1>
          <Button variant="outline" onClick={() => signOut()}>
            Se déconnecter
          </Button>
        </>
      ) : showModal ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold">Connexion requise</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Veuillez vous connecter avec Discord pour accéder à
              l'application.
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <Button onClick={handleSignIn}>Se connecter avec Discord</Button>
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-xl">chargement...</h1>
      )}
    </>
  )
}
