import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export async function GET(request:Request, {params}:{params:{id:string}}){
    try {
        const id = Number(params.id)
        const data = await prisma.rooms.findUnique({
            where:{
                room_id:id
            }
        })
        return Response.json(data)
    } catch (error) {
        console.log(error)
        return Response.json({error}, {status:500})
    }
}