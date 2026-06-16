import type { NextAuthOptions } from "next-auth";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'user@kitchenhub.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;
        
        // 1. ค้นหาผู้ใช้จากตาราง users
        const user = await prisma.users.findUnique({
          where: {
            email: credentials.email,
          }
        });

        // 2. ตรวจสอบรหัสผ่านและสถานะผู้ใช้ (ต้องเป็น active เท่านั้น)
        if (user && user.user_status === 'active' && (await bcrypt.compare(credentials.password, user.password))) {
          
          // 3. บันทึกประวัติการล็อกอินลงตาราง sessions (ที่เราเพิ่งสร้างไว้)
          const expiresDate = new Date();
          expiresDate.setDate(expiresDate.getDate() + 30); // ตั้งหมดอายุไว้ 30 วัน
          
          try {
            await prisma.sessions.create({
              data: {
                user_id: user.user_id,
                expires_at: expiresDate,
              }
            });
          } catch (error) {
            console.error("Failed to save session log:", error);
            // ไม่ต้อง throw error ปล่อยให้ล็อกอินผ่านไปแม้จะเก็บ Log ไม่สำเร็จ
          }

          // 4. ส่งข้อมูลกลับไปให้ NextAuth สร้าง Token
          return {
            id: String(user.user_id), // NextAuth บังคับให้ id เป็น string
            name: user.firstname,
            email: user.email,
            role: user.user_type,     // สิทธิ์: customer, chef, employee
            isAdmin: user.is_admin,   // สถานะแอดมิน: true หรือ false
          };
        } else {
          throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือบัญชีถูกระงับการใช้งาน');
        }
      },
    })
  ],
  pages: {
    signIn: '/signin', // ชี้ไปที่หน้า Custom Login ที่คุณสร้างไว้
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // อายุของคุกกี้ 30 วัน (หน่วยเป็นวินาที)
  },
  callbacks: {
    // 🟢 1. JWT Callback: ทำงานทุกครั้งที่ Token ถูกสร้าง (ตอนล็อกอิน) หรืออัปเดต
    async jwt({ token, user }) {
      if (user) {
        // ตอนล็อกอินสำเร็จ user จะมีค่า เราก็ยัดใส่ token
        token.id = user.id;
        token.role = user.role;
        token.isAdmin = user.isAdmin;
      }
      
      // เอาไว้ดูใน Terminal ว่าคุกกี้ปัจจุบันมีสิทธิ์แอดมินไหม
      // console.log("📌 JWT Token Data:", token); 
      
      return token;
    },
    
    // 🟢 2. Session Callback: ส่งข้อมูลจาก Token ไปให้หน้าบ้าน (useSession) ใช้
    async session({ session, token }) {
      if (session.user && token) {
        // ดึงจาก token กลับมาใส่ session คืน
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};