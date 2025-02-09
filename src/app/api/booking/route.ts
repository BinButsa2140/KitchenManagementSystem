import { PrismaClient } from "@prisma/client";
import { useSession} from "next-auth/react";
import { NextRequest } from "next/server";

const prisma = new PrismaClient() 


export async function GET(req:NextRequest){
    const searchParams = req.nextUrl.searchParams
    const user = searchParams.get('user')
    try {
        const booking_datas = await prisma.bookings.findMany({
            where:{
                customer_id:Number(user)
            }
        })
        return Response.json(booking_datas)
    } catch (error) {
        console.log(error)
}}
