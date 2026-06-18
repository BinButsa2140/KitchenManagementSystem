import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// 🟡 PATCH: อัปเดตสถานะการจอง (เช่น active, inactive, cancelled)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const { booking_status } = body;

    if (!booking_status) {
      return NextResponse.json({ error: "Missing booking_status" }, { status: 400 });
    }

    const updatedBooking = await prisma.bookings.update({
      where: { booking_id: id },
      data: { booking_status },
    });

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    console.error("Update Booking Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
