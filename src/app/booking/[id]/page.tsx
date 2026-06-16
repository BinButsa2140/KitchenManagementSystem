"use client";

import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BookingType } from "../../utils/models/Booking";
import { format } from "date-fns";
import { th } from "date-fns/locale";

const BookingPage = () => {
  const { data: session, status } = useSession();
  const [booking, setBooking] = useState<BookingType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 1. ดึงค่า ID จาก URL Path (เช่น /booking/3 จะได้ id = "3")
  const params = useParams();
  const id = params.id; 

  useEffect(() => {
    async function fetchBooking() {
      if (!id) return;
      try {
        setIsLoading(true);
        const url = `/api/booking?booking_id=${id}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("ไม่สามารถดึงข้อมูลการจองได้");
        }
        const data = await res.json();
        setBooking(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBooking();
  }, [id]);

  // สมมติว่าต้องการแสดง Loading ตอนดึง session หรือข้อมูล
  if (status === "loading" || isLoading) {
    return <div className="p-10 text-center text-lg">กำลังโหลด...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  if (!booking) {
    return <div className="p-10 text-center">ไม่พบข้อมูลการจอง</div>;
  }

  const start = new Date(booking.start_time);
  const end = new Date(booking.end_time);

  return (
    <div className="mx-4 sm:mx-8 lg:mx-52 my-8 sm:my-12 lg:my-20 p-4 sm:p-0">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-5">รายละเอียดการจอง</h1>
      <div className="p-4 sm:p-6 border-2 border-orange-100 rounded-2xl shadow-md bg-white">
        <div className="flex flex-col gap-3 sm:gap-4">
          <p className="text-sm sm:text-base lg:text-lg">
            <strong>หมายเลขการจอง (Booking ID):</strong> {booking.booking_id}
          </p>
          <p className="text-sm sm:text-base lg:text-lg">
            <strong>ห้องที่จอง:</strong> {booking.room?.room_name || `ห้อง #${booking.room_id}`}
          </p>
          <p className="text-sm sm:text-base lg:text-lg">
            <strong>วันที่:</strong> {format(start, "d MMMM yyyy", { locale: th })}
          </p>
          <p className="text-sm sm:text-base lg:text-lg">
            <strong>เวลา:</strong> {format(start, "HH:mm")} - {format(end, "HH:mm")} น.
          </p>
          <p className="text-sm sm:text-base lg:text-lg">
            <strong>ผู้จอง:</strong> {session?.user?.email || `User ID: ${booking.user_id}`}
          </p>
          <p className="text-sm sm:text-base lg:text-lg flex items-center gap-2">
            <strong>สถานะ:</strong> 
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              booking.booking_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {booking.booking_status === 'active' ? 'ยืนยันแล้ว' : booking.booking_status}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
