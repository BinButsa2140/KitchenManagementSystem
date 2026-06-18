import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

// 🟢 GET: ดึงรายชื่อผู้ใช้งานทั้งหมด
export async function GET() {
  try {
    const users = await prisma.users.findMany({
      orderBy: { created_at: "desc" },
    });

    // ลบรหัสผ่านออกก่อนส่งไปหน้าบ้านเพื่อความปลอดภัย
    const safeUsers = users.map(({ password, ...rest }) => rest);

    return NextResponse.json(safeUsers, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "ดึงข้อมูลผู้ใช้งานล้มเหลว" }, { status: 500 });
  }
}

// 🔵 POST: เพิ่มผู้ใช้งานใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstname, lastname, gender, phone_number,
      email, password, date_of_birth, user_type, user_status
    } = body;

    // เข้ารหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        firstname,
        lastname,
        gender,
        phone_number,
        email,
        password: hashedPassword,
        date_of_birth: new Date(date_of_birth),
        user_type,
        user_status,
        is_admin: false, // Default เป็น false
      },
    });

    const { password: _, ...safeUser } = newUser;
    return NextResponse.json(safeUser, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ message: "อีเมลหรือเบอร์โทรศัพท์นี้ถูกใช้งานแล้ว" }, { status: 400 });
    }
    return NextResponse.json({ message: "สร้างผู้ใช้งานล้มเหลว", details: error.message }, { status: 500 });
  }
}