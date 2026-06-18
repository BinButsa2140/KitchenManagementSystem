"use client";

import { listRooms } from "@/app/utils/room";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Cat, Store, ArrowRight, ChefHat } from "lucide-react"; // ใช้ Lucide React

type Room = {
  room_id: number;
  room_name: string;
  room_type: string;
  image: string | null;
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {room.map((data) => {
        return (
          <Link href={`/room/${data.room_id}`} key={data.room_id} className="block group h-full">
            <div className="bg-white rounded-[2rem] border border-orange-50 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 h-full flex flex-col">
              
              {/* ส่วนรูปภาพห้อง */}
              <div className="relative h-52 sm:h-64 overflow-hidden">
                <img 
                  src={data.image || "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop"} 
                  alt={data.room_name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Badge บอกประเภทห้อง แบบลอยบนรูป */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-orange-500/90 backdrop-blur-md rounded-full border border-orange-400/30 flex items-center gap-1.5 shadow-lg">
                    <ChefHat className="w-3.5 h-3.5" />
                    {data.room_type}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-50 text-orange-500 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                      <Store className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <span className="text-xs font-bold text-orange-600/70 uppercase tracking-widest">Available Now</span>
                  </div>

                  {/* ส่วนเนื้อหา: ชื่อห้อง */}
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight">
                    {data.room_name}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                    สัมผัสประสบการณ์การทำอาหารในห้องครัวมาตรฐานระดับโปร พร้อมอุปกรณ์ครบครัน
                  </p>
                </div>
                
                {/* ส่วนท้าย: ลิงก์พร้อมลูกศรชี้ */}
                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between text-orange-500 text-sm font-bold tracking-wide">
                  <span>ดูรายละเอียดและจอง</span>
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}