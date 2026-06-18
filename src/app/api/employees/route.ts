import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

// 🟢 GET: ดึงข้อมูลพนักงานทั้งหมด (เอาไปแสดงในตาราง Dashboard)
export async function GET() {
  try {
    const employees = await prisma.users.findMany({
      where: {
        user_type: "employee" // ดึงเฉพาะคนที่มี Role เป็นพนักงานเท่านั้น
      },
      include: {
        department: true, // ดึงข้อมูลแผนกมาแสดงด้วย
      },
      orderBy: {
        created_at: 'desc' // เรียงจากคนล่าสุด
      }
    });

    // ลบฟิลด์ password ออกก่อนส่งไปหน้าบ้านเพื่อความปลอดภัย!
    const safeEmployees = employees.map(({ password, ...rest }) => rest);

    return NextResponse.json(safeEmployees, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "ดึงข้อมูลพนักงานล้มเหลว", details: error.message },
      { status: 500 }
    );
  }
}

// 🔵 POST: สร้างพนักงานใหม่ (เพิ่มพนักงานเข้าระบบ)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstname,
      lastname,
      gender,
      phone_number,
      email,
      password,
      date_of_birth,
      department_id,
      employee_status, // รับค่ามาจากฟอร์มหน้าบ้าน (ชื่อตัวแปรเดิม)
    } = body;

    // 1. เข้ารหัสผ่าน
    const hashedPassword = bcrypt.hashSync(password, 10);

    // 2. บันทึกลงฐานข้อมูล users
    const newEmployee = await prisma.users.create({
      data: {
        firstname,
        lastname,
        gender,
        phone_number,
        email,
        password: hashedPassword,
        date_of_birth: new Date(date_of_birth),
        department_id: department_id ? Number(department_id) : null,
        user_status: employee_status || "active", // แมปเข้าฟิลด์ใหม่ user_status
        user_type: "employee", // บังคับให้เป็น employee เสมอเมื่อสร้างผ่าน API นี้
        is_admin: false, // ตั้งค่าเริ่มต้นเป็น false (ถ้าอยากให้เป็น Admin ค่อยไปปรับแก้ทีหลัง)
      },
    });

    // 3. ซ่อนรหัสผ่านก่อนส่งกลับ
    const { password: _, ...safeEmployee } = newEmployee;
    return NextResponse.json(safeEmployee, { status: 201 });

  } catch (error: any) {
    console.error("Error creating employee:", error);
    // ดักจับ Error หากอีเมลหรือเบอร์โทรซ้ำ
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "อีเมลหรือเบอร์โทรศัพท์นี้มีในระบบแล้ว" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "สร้างข้อมูลพนักงานล้มเหลว", details: error.message },
      { status: 500 }
    );
  }
}