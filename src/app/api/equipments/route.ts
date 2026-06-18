import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(){
    
    try {
        const equipments = await prisma.equipments.findMany({})
        return NextResponse.json(equipments)
    
    } catch (error) {
        console.error("Error fetching equipments:", error);
        return NextResponse.json({ error: "Failed to fetch equipments" }, { status: 500 })    
    }
}