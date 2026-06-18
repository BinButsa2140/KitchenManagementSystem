import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(){
    try {
        const roomData = await prisma.rooms.findMany()
        return NextResponse.json(roomData)
    } catch (error) {
        console.error(`ERROR : ${error}`)
        return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 })
    }
} 
 