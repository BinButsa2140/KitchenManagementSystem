import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

// PUT: อัปเดตข้อมูลพนักงาน
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { 
      firstname, lastname, gender, phone_number, email, 
      password, date_of_birth, department_id, employee_status 
    } = body;

    const employeeId = Number(params.id);

    // เตรียมก้อนข้อมูลที่จะอัปเดต
    const updateData: any = {
      firstname,
      lastname,
      gender,
      phone_number,
      email,
      employee_status,
    };

    // อัปเดตวันที่และแผนกเฉพาะตอนที่มีการส่งค่ามา
    if (date_of_birth) updateData.date_of_birth = new Date(date_of_birth);
    if (department_id !== undefined) updateData.department_id = department_id ? Number(department_id) : null;
    
    // ถ้ามีการส่งรหัสผ่านใหม่มา ให้เข้ารหัสก่อนเซฟ
    if (password && password.trim() !== "") {
      updateData.password = bcrypt.hashSync(password, 10);
    }

    const updatedEmployee = await prisma.employees.update({
      where: { employee_id: employeeId },
      data: updateData,
    });

    const { password: _, ...safeEmployee } = updatedEmployee;
    return NextResponse.json(safeEmployee, { status: 200 });

  } catch (error: any) {
    console.error("Error updating employee:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "อีเมลหรือเบอร์โทรนี้ถูกใช้ไปแล้ว" }, { status: 400 });
    }
    return NextResponse.json({ error: "อัปเดตข้อมูลล้มเหลว", details: error.message }, { status: 500 });
  }
}

// DELETE: ลบพนักงาน (ใช้ Soft Delete เปลี่ยนสถานะเป็น inactive)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employeeId = Number(params.id);

    // เราไม่ใช้ .delete() เพราะอาจติด Foreign Key กับ Rooms และ Equipments
    // จึงเปลี่ยนเป็นอัปเดตสถานะให้เป็น inactive แทน
    await prisma.employees.update({
      where: { employee_id: employeeId },
      data: { employee_status: "inactive" },
    });

    return NextResponse.json(
      { message: "ระงับสิทธิ์พนักงานสำเร็จ (Inactive)" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { error: "ลบพนักงานล้มเหลว", details: error.message },
      { status: 500 }
    );
  }
}