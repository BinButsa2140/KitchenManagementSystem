"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import SelectDate from "../SelectDate/SelectDate";
import { toast } from "react-toastify";

const bookingSchema = z.object({
  booking_time: z.string().min(1, "กรุณาเลือกวันที่ต้องการจอง"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  room_id: string | number;
}

export const BookingForm = ({ room_id }: BookingFormProps) => {
  const { data: session } = useSession();
  const user_id = session?.user?.id; // ดึง ID ของ user จาก token

  const { register, handleSubmit } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit: SubmitHandler<BookingFormData> = async (data) => {
    if (!room_id || !user_id) {
      toast.error("ข้อมูลห้องพักหรือข้อมูลผู้ใช้งานไม่ถูกต้อง กรุณาล็อกอินอีกครั้ง");
      return;
    }

    // ยิง API ไปที่ endpoint โดยตรงใช้ user_id
    const url = `/api/booking?customer_id=${user_id}&room_id=${room_id}&booking_time=${encodeURIComponent(data.booking_time)}`;
    
    try {
      const response = await fetch(url, { method: "POST" });
      const result = await response.json();
      
      if (response.ok) {
        toast.success("ส่งคำขอจองห้องครัวเรียบร้อยแล้ว! 🍳");
      } else {
        toast.error(result.error || "เกิดข้อผิดพลาดในการจองห้อง");
      }
    } catch (error) {
      console.error(error);
      toast.error("ระบบเครือข่ายขัดข้อง กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-100/50 p-4 sm:p-0 w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-xs sm:max-w-md border border-orange-50">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">เลือกวันจองห้อง</h3>
        <SelectDate register={register} />
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 sm:py-3 px-4 rounded-xl hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-200 transition-all font-semibold mt-4 sm:mt-6 shadow-md shadow-orange-100"
        >
          ยืนยันการจองครัว
        </button>
      </form>
    </div>
  );
};

export default BookingForm;