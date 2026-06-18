import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
        return NextResponse.json(equipments)


    } catch (error) {
        console.error("Error fetching equipment:", error);
        return NextResponse.json({ error: "Failed to fetch equipment" }, { status: 500 })
    }
}