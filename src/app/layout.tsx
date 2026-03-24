"use client";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { NoteProvider } from "@/context/NoteContext";
import { Figtree } from "next/font/google";
import { cn } from "@/lib/utils";
import Nav from "@/components/Nav";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", figtree.variable)}>
      <body className="h-screen">
        <NoteProvider>
          <SessionProvider>
            <div className="flex h-full">
              <Nav /> 
              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </div>
          </SessionProvider>
        </NoteProvider>
      </body>
    </html>
  );
}