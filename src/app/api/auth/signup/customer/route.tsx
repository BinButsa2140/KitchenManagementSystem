import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // 1. รับข้อมูลจาก Frontend
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

    // 2. เข้ารหัสรหัสผ่าน
    const hashedpassword = bcrypt.hashSync(password, 10);

    // 3. บันทึกลงฐานข้อมูล
    const newData = await prisma.customers.create({
      data: {
        firstname: fname,
        lastname: lname,
        date_of_birth,
        customer_type,
        email,
        password: hashedpassword,
        phone_number,
      },
    });

    return NextResponse.json(newData, { status: 201 }); // 201 Created

  } catch (error: any) {
    // เปิด Console เพื่อให้เราเห็นสาเหตุที่แท้จริงใน Terminal!
    console.error("🔥 ERROR FROM PRISMA:", error);

    // ดักจับ Error กรณีข้อมูลซ้ำ (เช่น Email หรือเบอร์โทร)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: "อีเมลหรือเบอร์โทรศัพท์นี้ถูกใช้งานแล้วในระบบ" },
        { status: 400 } // 400 Bad Request
      );
    }

    // กรณี Error อื่นๆ
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการสร้างบัญชี", details: error.message },
      { status: 500 }
    );
  }
}