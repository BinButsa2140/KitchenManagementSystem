"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/Input/Input";
import Selects from "@/components/Input/Selects";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

const FormSchema = z
  .object({
    firstname: z.string().min(1, "กรุณากรอกชื่อ").max(100, "ชื่อยาวเกินไป"),
    lastname: z.string().min(1, "กรุณากรอกนามสกุล").max(100, "นามสกุลยาวเกินไป"),
    email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
    password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร").max(32, "รหัสผ่านต้องไม่เกิน 32 ตัวอักษร"),
    ConPassword: z.string(),
    user_type: z.string().min(1, "กรุณาเลือกประเภทผู้ใช้งาน"), // แก้เป็น user_type
    phone_number: z
      .string()
      .min(9, "เบอร์โทรศัพท์สั้นเกินไป")
      .max(10, "เบอร์โทรศัพท์ยาวเกินไป")
      .regex(/^[0-9]+$/, "กรุณากรอกเฉพาะตัวเลข"),
    date_of_birth: z.coerce.date({ required_error: "กรุณาเลือกวันเกิด" }),
  })
  .refine((data) => data.password === data.ConPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["ConPassword"],
  });

type FormSchemaType = z.infer<typeof FormSchema>;

const SignupPage = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (value) => {
    try {
      const response = await fetch('/api/auth/signup', { // ชี้ไปที่ API รวมสมัครสมาชิก
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fname: value.firstname,
          lname: value.lastname,
          date_of_birth: value.date_of_birth.toISOString(),
          customer_type: value.user_type, // ส่งค่าไปโดยแมปคู่ตัวแปรหลังบ้าน
          email: value.email,
          password: value.password,
          phone_number: value.phone_number,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "การสมัครสมาชิกผู้ใช้งานล้มเหลว");
      }

      toast.success("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ...");
      router.push('/signin');
    } catch (error: any) {
      toast.error(error.message || "เกิดข้อผิดพลาดในการลงทะเบียน");
      console.error(error);
    }
  };

  const accountRoles = [
    { label: "Customer (ลูกค้าทั่วไป)", value: "customer" },
    { label: "Chef (เชฟ)", value: "chef" },
    { label: "Employee (พนักงาน)", value: "employee" }, // เพิ่มสิทธิ์ให้เลือกสมัครได้
  ];

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 relative py-12"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556910103-1c02745a872f?q=80&w=2070&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative z-10 w-full max-w-xs sm:max-w-lg lg:max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-orange-600 py-6 px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">🍳 สมัครสมาชิก</h1>
          <p className="text-orange-100 text-sm">สร้างบัญชีผู้ใช้ร่วมในระบบ Kitchen Hub</p>
        </div>

        <div className="p-6 sm:p-8">
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="ชื่อจริง" name="firstname" type="text" placeholder="สมชาย" register={register} error={errors?.firstname?.message} disable={isSubmitting} />
              <Input label="นามสกุล" name="lastname" type="text" placeholder="ใจดี" register={register} error={errors?.lastname?.message} disable={isSubmitting} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="เบอร์โทรศัพท์" name="phone_number" type="text" placeholder="0812345678" register={register} error={errors?.phone_number?.message} disable={isSubmitting} />
              <Selects name="user_type" label="ประเภทผู้ใช้งาน" register={register} error={errors?.user_type?.message} disable={isSubmitting} options={accountRoles} />
            </div>

            <Input label="วัน/เดือน/ปีเกิด" name="date_of_birth" type="date" register={register} error={errors?.date_of_birth?.message} disable={isSubmitting} />
            <Input label="อีเมล" name="email" type="email" placeholder="user@kitchenhub.com" register={register} error={errors?.email?.message} disable={isSubmitting} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="รหัสผ่าน" name="password" type="password" placeholder="••••••••" register={register} error={errors?.password?.message} disable={isSubmitting} />
              <Input label="ยืนยันรหัสผ่าน" name="ConPassword" type="password" placeholder="••••••••" register={register} error={errors?.ConPassword?.message} disable={isSubmitting} />
            </div>

            <button className="w-full mt-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-70" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "กำลังบันทึกข้อมูล..." : "สมัครสมาชิกตอนนี้"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-gray-600 text-sm">
              มีบัญชีผู้ใช้งานอยู่แล้ว? <Link href="/signin" className="font-bold text-orange-600 hover:text-orange-800 transition-colors">เข้าสู่ระบบ</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;