import NextAuth, { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // ajoute l'id
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
  }
}