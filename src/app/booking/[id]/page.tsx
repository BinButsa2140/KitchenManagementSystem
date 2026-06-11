"use client";

import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";

const BookingPage = () => {
  const { data: session, status } = useSession();
  
  // 1. ดึงค่า ID จาก URL Path (เช่น /booking/3 จะได้ id = "3")
  const params = useParams();
  const id = params.id; 

  // 2. ดึงค่า Query String (เช่น /booking/3?room=5 จะได้ room = "5")
  const searchParams = useSearchParams();
  const room_id = searchParams.get('room');

  // สมมติว่าต้องการแสดง Loading ตอนดึง session
  if (status === "loading") {
    return <div className="p-10 text-center">กำลังโหลด...</div>;
  }

  return (
    <div className="mx-4 sm:mx-8 lg:mx-52 my-8 sm:my-12 lg:my-20 p-4 sm:p-0">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-5">รายละเอียดการจอง</h1>
      <div className="p-4 sm:p-6 border-2 border-orange-100 rounded-2xl shadow-md bg-white">
        <p className="text-sm sm:text-base lg:text-lg mb-2 sm:mb-3"><strong>Booking ID:</strong> {id}</p>
        <p className="text-sm sm:text-base lg:text-lg mb-2 sm:mb-3"><strong>Room ID (จาก Query):</strong> {room_id || "ไม่ได้ระบุ"}</p>
        <p className="text-sm sm:text-base lg:text-lg"><strong>ผู้จอง:</strong> {session?.user?.email}</p>
      </div>
    </div>
  );
};

export default BookingPage;