import type { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';



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
        
        // 1. เธเนเธเธซเธฒเธเธนเนเนเธเนเธเธฒเธเธ•เธฒเธฃเธฒเธ users
        const user = await prisma.users.findUnique({
          where: {
            email: credentials.email,
          }
        });

        // 2. เธ•เธฃเธงเธเธชเธญเธเธฃเธซเธฑเธชเธเนเธฒเธเนเธฅเธฐเธชเธ–เธฒเธเธฐเธเธนเนเนเธเน (เธ•เนเธญเธเน€เธเนเธ active เน€เธ—เนเธฒเธเธฑเนเธ)
        if (user && user.user_status === 'active' && (await bcrypt.compare(credentials.password, user.password))) {
          
          // 3. เธเธฑเธเธ—เธถเธเธเธฃเธฐเธงเธฑเธ•เธดเธเธฒเธฃเธฅเนเธญเธเธญเธดเธเธฅเธเธ•เธฒเธฃเธฒเธ sessions (เธ—เธตเนเน€เธฃเธฒเน€เธเธดเนเธเธชเธฃเนเธฒเธเนเธงเน)
          const expiresDate = new Date();
          expiresDate.setDate(expiresDate.getDate() + 30); // เธ•เธฑเนเธเธซเธกเธ”เธญเธฒเธขเธธเนเธงเน 30 เธงเธฑเธ
          
          try {
            await prisma.sessions.create({
              data: {
                user_id: user.user_id,
                expires_at: expiresDate,
              }
            });
          } catch (error) {
            console.error("Failed to save session log:", error);
            // เนเธกเนเธ•เนเธญเธ throw error เธเธฅเนเธญเธขเนเธซเนเธฅเนเธญเธเธญเธดเธเธเนเธฒเธเนเธเนเธกเนเธเธฐเน€เธเนเธ Log เนเธกเนเธชเธณเน€เธฃเนเธ
          }

          // 4. เธชเนเธเธเนเธญเธกเธนเธฅเธเธฅเธฑเธเนเธเนเธซเน NextAuth เธชเธฃเนเธฒเธ Token
          return {
            id: String(user.user_id), // NextAuth เธเธฑเธเธเธฑเธเนเธซเน id เน€เธเนเธ string
            name: user.firstname,
            email: user.email,
            role: user.user_type,     // เธชเธดเธ—เธเธดเน: customer, chef, employee
            isAdmin: user.is_admin,   // เธชเธ–เธฒเธเธฐเนเธญเธ”เธกเธดเธ: true เธซเธฃเธทเธญ false
          };
        } else {
          throw new Error('เธญเธตเน€เธกเธฅเธซเธฃเธทเธญเธฃเธซเธฑเธชเธเนเธฒเธเนเธกเนเธ–เธนเธเธ•เนเธญเธ เธซเธฃเธทเธญเธเธฑเธเธเธตเธ–เธนเธเธฃเธฐเธเธฑเธเธเธฒเธฃเนเธเนเธเธฒเธ');
        }
      },
    })
  ],
  pages: {
    signIn: '/signin', // เธเธตเนเนเธเธ—เธตเนเธซเธเนเธฒ Custom Login เธ—เธตเนเธเธธเธ“เธชเธฃเนเธฒเธเนเธงเน
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // เธญเธฒเธขเธธเธเธญเธเธเธธเธเธเธตเน 30 เธงเธฑเธ (เธซเธเนเธงเธขเน€เธเนเธเธงเธดเธเธฒเธ—เธต)
  },
  callbacks: {
    // ๐ข 1. JWT Callback: เธ—เธณเธเธฒเธเธ—เธธเธเธเธฃเธฑเนเธเธ—เธตเน Token เธ–เธนเธเธชเธฃเนเธฒเธ (เธ•เธญเธเธฅเนเธญเธเธญเธดเธ) เธซเธฃเธทเธญเธญเธฑเธเน€เธ”เธ•
    async jwt({ token, user }) {
      if (user) {
        // เธ•เธญเธเธฅเนเธญเธเธญเธดเธเธชเธณเน€เธฃเนเธ user เธเธฐเธกเธตเธเนเธฒ เน€เธฃเธฒเธเนเธขเธฑเธ”เนเธชเน token
        token.id = user.id;
        token.role = user.role;
        token.isAdmin = user.isAdmin;
      }
      
      // เน€เธญเธฒเนเธงเนเธ”เธนเนเธ Terminal เธงเนเธฒเธเธธเธเธเธตเนเธเธฑเธเธเธธเธเธฑเธเธกเธตเธชเธดเธ—เธเธดเนเนเธญเธ”เธกเธดเธเนเธซเธก
      // console.log("๐“ JWT Token Data:", token); 
      
      return token;
    },
    
    // ๐ข 2. Session Callback: เธชเนเธเธเนเธญเธกเธนเธฅเธเธฒเธ Token เนเธเนเธซเนเธซเธเนเธฒเธเนเธฒเธ (useSession) เนเธเน
    async session({ session, token }) {
      if (session.user && token) {
        // เธ”เธถเธเธเธฒเธ token เธเธฅเธฑเธเธกเธฒเนเธชเน session เธเธทเธ
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
