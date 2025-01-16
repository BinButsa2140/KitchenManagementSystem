import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export async function GET(){
    
    try {
        const equipments = await prisma.equipments.findMany({})
        return Response.json(equipments)
    
    } catch (error) {
        return Response.json(error)    
    }
}