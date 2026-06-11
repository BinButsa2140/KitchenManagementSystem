import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// 🟢 GET: ดึงข้อมูลการจองตามสิทธิ์ User รายคน
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const user = searchParams.get("user");
  
  if (!user) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  try {
    const booking_datas = await prisma.bookings.findMany({
      where: {
        user_id: Number(user), // เปลี่ยนจาก customer_id -> user_id
      },
      include: {
        room: true // ดึงข้อมูลห้องพ่วงไปด้วยช่วยให้หน้าบ้านแสดงผลง่ายขึ้น
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return NextResponse.json(booking_datas);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 🔵 POST: บันทึกรายการจองครัวใหม่
export async function POST(request: NextRequest) {
  const searchparams = request.nextUrl.searchParams;
  const user_id = searchparams.get("customer_id"); // ยอมรับ Query ที่ส่งมาแก้ชื่อภายใน
  const room_id = searchparams.get("room_id");
  const booking_time = searchparams.get("booking_time");

  if (!user_id || !room_id || !booking_time) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const userIdNum = parseInt(user_id);
  const roomIdNum = parseInt(room_id);

  if (isNaN(userIdNum) || isNaN(roomIdNum)) {
    return NextResponse.json({ error: "Invalid user_id or room_id" }, { status: 400 });
  }

  try {
    const result = await prisma.bookings.create({
      data: {
        user_id: userIdNum, // ชี้ไปหา Relations ใหม่ใน schema
        room_id: roomIdNum,
        booking_time: new Date(booking_time),
        booking_status: "active",
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating booking" }, { status: 500 });
  }
}