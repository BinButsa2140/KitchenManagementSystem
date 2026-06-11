import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  // ขยาย Type ของ User ที่คืนค่ามาจาก authorize()
  interface User {
    id: string;
    role: string;
    isAdmin: boolean;
  }

  // ขยาย Type ของ Session object
  interface Session {
    user: {
      id: string;
      role: string;
      isAdmin: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  // ขยาย Type ของ JWT token
  interface JWT {
    id: string;
    role: string;
    isAdmin: boolean;
  }
}