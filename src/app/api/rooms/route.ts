import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(){
    try {
        const roomData = await prisma.rooms.findMany()
        console.log(roomData)
        return Response.json(roomData)
    } catch (error) {
        console.log(`ERROR : ${error}`)
    }
} 