import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    /**
     * 1. การป้องกันระดับ Admin
     * ถ้าพยายามเข้าหน้า /admin หรือ /api/admin แต่ไม่มีสิทธิ์ isAdmin ให้ดีดออก
     */
    if ((path.startsWith("/admin") || path.startsWith("/api/admin")) && !token?.isAdmin) {
      // ถ้าเป็น API ให้ส่ง JSON Error
      if (path.startsWith("/api")) {
        return NextResponse.json({ error: "Unauthorized: Admin access only" }, { status: 403 });
      }
      // ถ้าเป็นหน้าเว็บปกติ ให้ส่งไปหน้าแรก
      return NextResponse.redirect(new URL("/", req.url));
    }

    /**
     * 2. การจัดการหน้า Login/Signup
     * ถ้า Login อยู่แล้ว ไม่ควรเข้าหน้า signin/signup ได้อีก
     */
    if ((path === "/signin" || path === "/signup") && !!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      /**
       * ตรวจสอบสิทธิ์การเข้าถึงเบื้องต้น
       * return true = อนุญาตให้ผ่านไปที่ middleware function ด้านบน
       * return false = ดีดไปหน้า signIn ทันที
       */
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // รายการหน้าที่ปล่อยให้ Guest เข้าได้ (แม้จะอยู่ใน matcher)
        const publicPaths = ["/signin", "/signup"];
        if (publicPaths.includes(path)) return true;

        // หน้าอื่นๆ ที่อยู่ใน matcher ทั้งหมดต้องมี token (Login แล้ว)
        return !!token;
      },
    },
    pages: {
      signIn: "/signin",
    },
  }
);

/**
 * กำหนด Path ที่ต้องการให้ Middleware ทำงาน (Matcher)
 * ครอบคลุมทั้งหน้าเว็บและ API ที่สำคัญ
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth endpoints)
     * - api/signup (Public signup endpoint)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/admin/:path*",
    "/booking/:path*",
    "/mybooking",
    "/profile",
    "/signin",
    "/signup",
    // ป้องกัน API ต่างๆ (ยกเว้น auth และ signup)
    "/api/users/:path*",
    "/api/employees/:path*",
    "/api/booking/:path*",
    "/api/bookroom/:path*",
  ],
};
