import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';


const prisma = new PrismaClient()

export const options:NextAuthOptions={
    providers: [
        CredentialsProvider({
          name: 'Credentials',
          credentials: {
            email: { label: 'Email', type: 'email', placeholder: 'john@doe.com' },
            password: { label: 'Password', type: 'password' },
          },
          //ตรวจสอบ gin 
          async authorize(credentials, req) {//authen with database using prisma
              if(!credentials) return null
              const user = await prisma.customers.findUnique({
                where: {
                  email: credentials.email,
                }
              })
              if(user && (await bcrypt.compare(credentials.password, user.password))){
                return  {
                  customer_id: user.customer_id,
                  name: user.firstname,
                  email: user.email,
                  type: user.customer_type,
                }
              }
              else {
                throw new Error('Invalid email or password')
              }
          },
        })
      ],
      pages:{
        signIn:'/signin'
      },
    adapter: PrismaAdapter(prisma),
    session: {
        strategy:'jwt',
    },
    callbacks: {
      session: async ({ session, token }) => {
        if (session?.user) {
          session.user.id = token.customer_id;
        }
        return session;
      },
      jwt: async ({ user, token }) => {
        if (user) {
          token.customer_id = user.customer_id;
        }
        return token;
      },
    },
    session: {
      strategy: 'jwt',
    },


        
}