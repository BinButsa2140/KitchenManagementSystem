import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";  // ตรวจสอบการใช้งานจาก Next.js v13

export async function POST(request: NextRequest) {
    const searchparams = request.nextUrl.searchParams;
    const customer_id = searchparams.get('customer_id');
    const room_id = searchparams.get('room_id');
    const booking_time = searchparams.get('booking_time');

    // ตรวจสอบค่าพารามิเตอร์
    if (!customer_id || !room_id || !booking_time) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // แปลง customer_id และ room_id เป็นตัวเลข
    const customerIdNum = parseInt(customer_id);
    const roomIdNum = parseInt(room_id);

    // ตรวจสอบว่าเป็นตัวเลขหรือไม่
    if (isNaN(customerIdNum) || isNaN(roomIdNum)) {
        return NextResponse.json({ error: "Invalid customer_id or room_id" }, { status: 400 });
    }

    try {
        // สร้างการจองในฐานข้อมูล
        const result = await prisma.bookings.create({
            data: {
                user_id: customerIdNum, // เปลี่ยนจาก customer_id: ... เป็น user_id: ...
                room_id: roomIdNum,
                booking_time: new Date(booking_time),
                booking_status: 'active',
            }
        });

        // คืนค่าผลลัพธ์การจอง
        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error creating booking" }, { status: 500 });
    }
}
