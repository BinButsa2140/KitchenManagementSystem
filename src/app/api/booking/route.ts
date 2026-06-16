import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// 🟢 GET: ดึงข้อมูลการจองตามสิทธิ์ User รายคน หรือตาม booking_id หรือทั้งหมด (สำหรับ admin)
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const user = searchParams.get("user");
  const booking_id = searchParams.get("booking_id");
  const all = searchParams.get("all");

  if (all === "true") {
    try {
      const bookings = await prisma.bookings.findMany({
        include: { room: true, user: true },
        orderBy: { start_time: "desc" },
      });
      return NextResponse.json(bookings);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  
  if (booking_id) {
    try {
      const booking = await prisma.bookings.findUnique({
        where: { booking_id: Number(booking_id) },
        include: { room: true },
      });
      if (!booking) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      }
      return NextResponse.json(booking);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

  if (!user) {
    return NextResponse.json({ error: "Missing user ID or booking_id" }, { status: 400 });
  }

  try {
    const booking_datas = await prisma.bookings.findMany({
      where: {
        user_id: Number(user),
      },
      include: {
        room: true
      },
      orderBy: {
        start_time: "desc",
      },
    });
    return NextResponse.json(booking_datas);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 🔵 POST: บันทึกรายการจองครัวใหม่ พร้อมตรวจสอบการจองซ้ำ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, room_id, start_time, end_time } = body;

    if (!user_id || !room_id || !start_time || !end_time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const start = new Date(start_time);
    const end = new Date(end_time);

    if (start >= end) {
      return NextResponse.json({ error: "Start time must be before end time" }, { status: 400 });
    }

    // 1. ตรวจสอบการจองซ้ำ (Conflict Validation)
    const existingBooking = await prisma.bookings.findFirst({
      where: {
        room_id: Number(room_id),
        booking_status: "active",
        OR: [
          {
            start_time: { lt: end },
            end_time: { gt: start },
          },
        ],
      },
    });

    if (existingBooking) {
      return NextResponse.json({ error: "ห้องครัวถูกจองแล้วในช่วงเวลานี้" }, { status: 409 });
    }

    // 2. บันทึกการจอง
    const result = await prisma.bookings.create({
      data: {
        user_id: Number(user_id),
        room_id: Number(room_id),
        start_time: start,
        end_time: end,
        booking_status: "active",
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Booking Error:", error);
    return NextResponse.json({ error: "Error creating booking" }, { status: 500 });
  }
}