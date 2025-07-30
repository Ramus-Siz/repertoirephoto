/* eslint-disable */
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;      // <-- Ajoute la propriété id ici
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;        // <-- Et ici aussi
    name?: string | null;
    email?: string | null;
  }
}
