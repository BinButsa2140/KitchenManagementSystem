import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
const prisma = new PrismaClient();

export async function GET(req:NextRequest){
    const searchParams = req.nextUrl.searchParams
    const room = searchParams.get('room')||1
    const name = searchParams.get('name')||''
    
    const condition = room ? (
        {
            room_id:Number(room),
            equipment_name:{
                contains:name,
            }
        }
    ):(
        {
            equipment_name:{
                contains:name,
            }
        }
    )
    try {
        const equipments = await prisma.equipments.findMany({
            where:condition
        })
        return Response.json(equipments)


    } catch (error) {
        return Response.json(error)
    }
}