import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fname,
      lname,
      date_of_birth,
      customer_type,
      email,
      password,
      phone_number,
    } = body;

    const hashedpassword = await bcrypt.hash(password, 10);

    const newData = await prisma.users.create({
      // เปลี่ยนจาก .customers เป็น .users
      data: {
        firstname: fname,
        lastname: lname,
        date_of_birth: new Date(date_of_birth),
        user_type: customer_type, // เปลี่ยนจาก customer_type เป็น user_type
        email,
        password: hashedpassword,
        phone_number,
        is_admin: false, // ใส่ค่าเริ่มต้น
        user_status: "active",
      },
    });

    return NextResponse.json(newData, { status: 201 });
  } catch (error: any) {
    // เปิด Console เพื่อให้เราเห็นสาเหตุที่แท้จริงใน Terminal!
    console.error("🔥 ERROR FROM PRISMA:", error);

    // ดักจับ Error กรณีข้อมูลซ้ำ (เช่น Email หรือเบอร์โทร)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "อีเมลหรือเบอร์โทรศัพท์นี้ถูกใช้งานแล้วในระบบ" },
        { status: 400 }, // 400 Bad Request
      );
    }

    // กรณี Error อื่นๆ
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสร้างบัญชี", details: error.message },
      { status: 500 },
    );
  }
}
