import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request:Request, {params}:{params:{id:string}}){
    try {
        const id = Number(params.id)
        const data = await prisma.rooms.findUnique({
            where:{
                room_id:id
            }
        })
        return NextResponse.json(data)
    } catch (error) {
        console.error("Error fetching room:", error);
        return NextResponse.json({error: "Failed to fetch room"}, {status:500})
    }
}