import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
    
    console.log('request', request)
    try {
        const {
            fname,
            lname,
            date_of_birth,
            customer_type,
            email,
            password,
            phone_number,
          } = await request.json();

          console.log(request)

          const hashedpassword = bcrypt.hashSync(password, 10);
          const newData = await prisma.customers.create({
            data:{
                firstname:fname,
                lastname:lname,
                date_of_birth,
                customer_type,
                email,
                password:hashedpassword,
                phone_number
            }
          })
          return NextResponse.json(newData);
    } catch (error) {
        //console.log(error)
        return NextResponse.json(error, {status:500})
    }
}
