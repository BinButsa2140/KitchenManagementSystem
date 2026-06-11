"use client";

import Input from "@/components/Input/Input";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import Link from "next/link"; // นำเข้า Link สำหรับทำปุ่มไปหน้า Signup

// ปรับปรุงข้อความ Validation ให้ตรงกับบริบทอีเมล
const FormSchema = z.object({
  email: z
    .string()
    .min(1, "กรุณากรอกอีเมล")
    .email("รูปแบบอีเมลไม่ถูกต้อง")
    .max(50, "อีเมลยาวเกินไป (ไม่เกิน 50 ตัวอักษร)"),
  password: z
    .string()
    .min(1, "กรุณากรอกรหัสผ่าน"),
});

type FormSchemaType = z.infer<typeof FormSchema>;

const LoginPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
    console.log("Submitted values:", values);
    const res: any = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });
    
    if (res?.error) {
      return toast.error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } else {
      toast.success("เข้าสู่ระบบสำเร็จ!");
      return router.push('/profile');
    }
  };

  return (
    // กำหนดภาพพื้นหลังเป็นรูปครัว (สามารถเปลี่ยน URL ภาพได้ตามต้องการ)
    <div 
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 relative"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556910103-1c02745a872f?q=80&w=2070&auto=format&fit=crop')" }}
    >
      {/* Overlay สีดำจางๆ เพื่อให้ตัวกล่อง Login โดดเด่นขึ้นมา */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* ส่วนกล่อง Login (Card) */}
      <div className="relative z-10 w-full max-w-xs sm:max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* ส่วนหัวของกล่อง */}
        <div className="bg-orange-600 py-4 sm:py-6 px-4 sm:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">🍳 Kitchen Hub</h1>
          <p className="text-orange-100 text-xs sm:text-sm">ระบบจองห้องครัวสำหรับเชฟมือโปร</p>
        </div>

        {/* ส่วนฟอร์ม */}
        <div className="p-4 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">เข้าสู่ระบบ</h2>
          
          <form
            className="flex flex-col space-y-4 sm:space-y-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              label="อีเมล"
              type="email"
              name="email"
              placeholder="chef@example.com"
              register={register}
              error={errors?.email?.message}
              disable={isSubmitting}
            />
            <Input
              label="รหัสผ่าน"
              type="password"
              name="password"
              placeholder="••••••••"
              register={register}
              error={errors?.password?.message}
              disable={isSubmitting}
            />
            
            {/* ปรับปุ่ม Submit ให้ดูสวยงามและกดง่ายขึ้น */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-2.5 sm:py-3 px-4 mt-2 sm:mt-4 bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm sm:text-base rounded-lg shadow-md transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "กำลังตรวจสอบข้อมูล..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          {/* ส่วนเชื่อมต่อไปยังหน้า Sign Up */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-600 text-xs sm:text-sm">
              ยังไม่มีบัญชีใช่หรือไม่?{" "}
              <Link 
                href="/signup" 
                className="font-bold text-orange-600 hover:text-orange-800 transition-colors"
              >
                สมัครสมาชิกที่นี่
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;