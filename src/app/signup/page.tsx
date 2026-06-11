"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "./../../components/Input/Input";
import Selects from "./../../components/Input/Selects";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link"; // นำเข้า Link สำหรับทำปุ่มไปหน้า Login

// ปรับปรุง Zod Schema: แปลข้อความเป็นภาษาไทย และแก้ Regex ให้รองรับชื่อภาษาไทยได้
const FormSchema = z
  .object({
    firstname: z
      .string()
      .min(1, "กรุณากรอกชื่อ")
      .max(100, "ชื่อยาวเกินไป (ไม่เกิน 100 ตัวอักษร)"),
    lastname: z
      .string()
      .min(1, "กรุณากรอกนามสกุล")
      .max(100, "นามสกุลยาวเกินไป (ไม่เกิน 100 ตัวอักษร)"),
    email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
    password: z
      .string()
      .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
      .max(32, "รหัสผ่านต้องไม่เกิน 32 ตัวอักษร"),
    ConPassword: z.string(),
    customer_type: z.string().min(1, "กรุณาเลือกประเภทผู้ใช้งาน"),
    phone_number: z
      .string()
      .min(9, "เบอร์โทรศัพท์สั้นเกินไป")
      .max(10, "เบอร์โทรศัพท์ยาวเกินไป")
      .regex(/^[0-9]+$/, "กรุณากรอกเฉพาะตัวเลข"),
    date_of_birth: z.coerce.date({
      required_error: "กรุณาเลือกวันเกิด",
      invalid_type_error: "รูปแบบวันที่ไม่ถูกต้อง",
    }),
  })
  .refine((data) => data.password === data.ConPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["ConPassword"], // ให้ Error ไปโชว์ที่ช่อง Confirm Password
  });

type FormSchemaType = z.infer<typeof FormSchema>;

const SignupPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const postdata = async (value: FormSchemaType) => {
    console.log("Sending Data...");
    try {
      const response = await fetch('/api/auth/signup/customer', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fname: value.firstname,
          lname: value.lastname,
          date_of_birth: value.date_of_birth.toISOString(),
          customer_type: value.customer_type,
          email: value.email,
          password: value.password,
          phone_number: value.phone_number,
        }),
      });

      if (!response.ok) {
        console.log('sign up fail');
        throw new Error("การสมัครสมาชิกหล้มเหลว");
      }
      const data = await response.json();
      console.log("response : ", data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
    try {
      await postdata(values);
      toast.success("สมัครสมาชิกสำเร็จ! กำลังพาท่านเข้าสู่ระบบ...");
      router.push('/profile');
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง");
      console.log(error);
    }
  };

  const roles = [
    { label: "Customer (ลูกค้าทั่วไป)", value: "customer" },
    { label: "Chef (เชฟ)", value: "chef" },
  ];

  return (
    // ภาพพื้นหลังห้องครัว
    <div 
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 relative py-12"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556910103-1c02745a872f?q=80&w=2070&auto=format&fit=crop')" }}
    >
      {/* Overlay สีดำจางๆ */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* กล่อง Form (ขยาย max-w ให้กว้างกว่าหน้า Login เล็กน้อย เพราะมีแบบกริด 2 คอลัมน์) */}
      <div className="relative z-10 w-full max-w-xs sm:max-w-lg lg:max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* ส่วนหัว */}
        <div className="bg-orange-600 py-4 sm:py-6 px-4 sm:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">🍳 สมัครสมาชิก</h1>
          <p className="text-orange-100 text-xs sm:text-sm">สร้างบัญชี Kitchen Hub เพื่อเริ่มใช้งาน</p>
        </div>

        <div className="p-4 sm:p-8">
          <form className="flex flex-col space-y-3 sm:space-y-4" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Grid 2 คอลัมน์สำหรับ ชื่อ-นามสกุล */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input
                label="ชื่อจริง"
                name="firstname"
                type="text"
                placeholder="สมชาย"
                register={register}
                error={errors?.firstname?.message}
                disable={isSubmitting}
              />
              <Input
                label="นามสกุล"
                name="lastname"
                type="text"
                placeholder="ใจดี"
                register={register}
                error={errors?.lastname?.message}
                disable={isSubmitting}
              />
            </div>

            {/* Grid 2 คอลัมน์สำหรับ เบอร์โทร-บทบาท */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input
                label="เบอร์โทรศัพท์"
                name="phone_number"
                type="text"
                placeholder="0812345678"
                register={register}
                error={errors?.phone_number?.message}
                disable={isSubmitting}
              />
              <Selects
                name="customer_type"
                label="ประเภทบัญชี"
                register={register}
                error={errors?.customer_type?.message}
                disable={isSubmitting}
                options={roles}
              />
            </div>

            {/* แถวเดี่ยว */}
            <Input
              label="วัน/เดือน/ปีเกิด"
              name="date_of_birth"
              type="date"
              placeholder="เลือกวันเกิด"
              register={register}
              error={errors?.date_of_birth?.message}
              disable={isSubmitting}
            />
            
            <Input
              label="อีเมล"
              name="email"
              type="email"
              placeholder="chef@example.com"
              register={register}
              error={errors?.email?.message}
              disable={isSubmitting}
            />

            {/* Grid 2 คอลัมน์สำหรับ รหัสผ่าน */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input
                label="รหัสผ่าน"
                name="password"
                type="password"
                placeholder="••••••••"
                register={register}
                error={errors?.password?.message}
                disable={isSubmitting}
              />
              <Input
                label="ยืนยันรหัสผ่าน"
                name="ConPassword"
                type="password"
                placeholder="••••••••"
                register={register}
                error={errors?.ConPassword?.message}
                disable={isSubmitting}
              />
            </div>

            {/* ปุ่ม Submit */}
            <div className="w-full mt-4 sm:mt-6 pt-2">
              <button
                className="w-full py-2.5 sm:py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm sm:text-base rounded-lg shadow-md transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "กำลังบันทึกข้อมูล..." : "สมัครสมาชิก"}
              </button>
            </div>
          </form>

          {/* ส่วนเชื่อมต่อไปยังหน้า Login */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600 text-xs sm:text-sm">
              มีบัญชีผู้ใช้งานอยู่แล้ว?{" "}
              <Link 
                href="/login" 
                className="font-bold text-orange-600 hover:text-orange-800 transition-colors"
              >
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignupPage;