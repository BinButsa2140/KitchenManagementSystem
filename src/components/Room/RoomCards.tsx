"use client";

import { listRooms } from "@/app/utils/room";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Cat, Store, ArrowRight, ChefHat } from "lucide-react"; // ใช้ Lucide React

type Room = {
  room_id: number;
  room_name: string;
  room_type: string;
};

export default function RoomCard() {
  const [room, setRoom] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await listRooms();
      setRoom(response);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // หน้า Loading สไตล์น้อนแมว (เหมือนหน้า Detail)
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center text-orange-400">
          <Loader2 className="h-12 w-12 animate-spin mb-4" strokeWidth={2.5} />
          <p className="font-medium flex items-center gap-2 animate-pulse">
            <Cat className="w-5 h-5" /> กำลังจัดเตรียมห้อง...
          </p>
        </div>
      </div>
    );
  }

  if (room.length === 0) {
    return (
      <div className="text-center py-12 sm:py-20 text-gray-400">
        <p className="text-sm sm:text-base">ยังไม่มีห้องให้จองในขณะนี้</p>
      </div>
    );
  }

  return (
    // จัด Grid ใหม่ให้สวยงาม: มือถือ 1 การ์ด, แท็บเล็ต 2 การ์ด, คอม 3 การ์ด
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {room.map((data) => {
        return (
          <Link href={`/room/${data.room_id}`} key={data.room_id} className="block group h-full">
            <div className="bg-white rounded-3xl border border-orange-50 p-4 sm:p-6 lg:p-7 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col justify-between relative overflow-hidden">
              
              {/* แถบสีส้มตกแต่งด้านบนของการ์ด */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-100 group-hover:bg-orange-500 transition-colors duration-300"></div>

              <div>
                {/* ส่วนหัว: ไอคอน และ ประเภทห้อง (Badge) */}
                <div className="flex justify-between items-start mb-4 sm:mb-6 pt-2">
                  <div className="p-2.5 sm:p-3.5 bg-orange-50 text-orange-500 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                    {/* ใช้ Icon จาก Lucide */}
                    <Store className="w-5 sm:w-6 h-5 sm:h-6" strokeWidth={2} />
                  </div>
                  
                  {/* Badge บอกประเภทห้อง */}
                  <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 rounded-full border border-orange-100 flex items-center gap-1">
                    <ChefHat className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                    <span className="hidden sm:inline">{data.room_type}</span><span className="sm:hidden">{data.room_type.charAt(0)}</span>
                  </span>
                </div>

                {/* ส่วนเนื้อหา: ชื่อห้อง */}
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                  {data.room_name}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                  คลิกเพื่อดูรายละเอียด อุปกรณ์ และจอง
                </p>
              </div>
              
              {/* ส่วนท้าย: ลิงก์พร้อมลูกศรชี้ */}
              <div className="mt-4 sm:mt-8 flex items-center text-orange-500 text-xs sm:text-sm font-bold tracking-wide">
                ดูรายละเอียด
                <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 ml-1.5 group-hover:translate-x-2 transition-transform duration-300" strokeWidth={2.5} />
              </div>

            </div>
          </Link>
        );
      })}
    </div>
  );
}