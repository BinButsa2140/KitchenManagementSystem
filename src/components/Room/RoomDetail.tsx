"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
// นำเข้า Icon สไตล์มินิมอลจาก lucide-react
import {
  ChefHat,
  Info,
  Wrench,
  CalendarCheck,
  ArrowLeft,
  Cat,
  Loader2,
  UtensilsCrossed,
} from "lucide-react";
import EquipmentsInRoom from "./EquipmentsInRoom";
import { fetchRoomData } from "@/app/utils/fetchRoom";
import { BookingForm } from "../BookForm/BookForm";
import { Room } from "@/app/utils/type";

export function RoomDetail({ id }: { id: string }) {
  const [roomData, setRoomData] = useState<Room | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRoomData(id);
        setRoomData(data);
      } catch (error) {
        console.error("Failed to fetch room data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // หน้า Loading น่ารักๆ สไตล์น้อนแมวเตรียมครัว
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="flex flex-col items-center text-orange-500">
          <Loader2 className="h-16 w-16 animate-spin mb-4" strokeWidth={2} />
          <p className="font-medium text-lg flex items-center gap-2 animate-pulse">
            <Cat className="w-5 h-5" /> กำลังให้น้อนแมวเตรียมข้อมูลห้อง...
          </p>
        </div>
      </div>
    );
  }

  if (!roomData)
    return (
      <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-3">
        <Cat className="w-16 h-16 text-gray-300" />
        <p>แง้ว... ไม่พบข้อมูลห้องพัก</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-[2rem] overflow-hidden p-3 sm:p-6 md:p-10 my-4 sm:my-8 border border-orange-50 relative">
      {/* กิมมิคแมวแอบดูมุมขวาบน (ตกแต่ง) */}
      <div className="absolute -top-4 -right-4 text-orange-100 opacity-50 pointer-events-none transform rotate-12">
        <Cat className="w-20 sm:w-32 h-20 sm:h-32" />
      </div>

      {/* ส่วนหัว: ชื่อห้อง และ ป้ายประเภทห้อง */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-orange-100 pb-3 sm:pb-5 mb-6 sm:mb-8 relative z-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 flex items-center gap-2 sm:gap-4">
          <div className="p-2 sm:p-3 bg-orange-100 text-orange-500 rounded-2xl shadow-sm">
            <UtensilsCrossed size={28} strokeWidth={2.5} className="sm:w-8 sm:h-8" />
          </div>
          {roomData.room_name}
        </h1>
        <span className="mt-3 md:mt-0 px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-orange-600 bg-orange-50 rounded-full shadow-sm border border-orange-100 flex items-center gap-1.5">
          <ChefHat className="w-3 sm:w-4 h-3 sm:h-4" /> {roomData.room_type}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-10 relative z-10">
        {/* คอลัมน์ซ้าย: รูปภาพ หรือ ฟอร์มการจอง */}
        <div className="bg-orange-50/50 p-2 rounded-3xl border border-orange-50 shadow-inner h-fit">
          {showForm ? (
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-orange-100">
              <BookingForm room_id={id} />
            </div>
          ) : (
            roomData.image && (
              <div className="relative w-full h-[250px] sm:h-[350px] lg:h-[450px] overflow-hidden rounded-2xl shadow-md group">
                <Image
                  src={roomData.image}
                  alt={roomData.room_name || "Room Image"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                />
                {/* Overlay ไล่สีส้มอ่อนๆ ด้านล่าง */}
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            )
          )}
        </div>

        {/* คอลัมน์ขวา: ข้อมูลและปุ่ม */}
        <div className="flex flex-col space-y-4 sm:space-y-8">
          {/* กล่อง Description */}
          <div className="bg-gradient-to-br from-orange-50 to-white p-4 sm:p-7 rounded-3xl border border-orange-100 shadow-sm relative overflow-hidden">
            <h2 className="font-bold text-base sm:text-lg text-orange-600 mb-2 sm:mb-3 flex items-center gap-2">
              <Info className="w-4 sm:w-5 h-4 sm:h-5" strokeWidth={2.5} />
              รายละเอียดห้อง
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed relative z-10">
              {roomData.description || "ไม่มีคำอธิบายเพิ่มเติมสำหรับห้องนี้"}
            </p>
          </div>

          {/* กล่อง Equipments */}
          <div className="px-2">
            <h2 className="font-bold text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 flex items-center gap-2 border-b-2 border-gray-100 pb-2 sm:pb-3">
              <Wrench className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" strokeWidth={2.5} />
              อุปกรณ์ที่มีในห้อง
            </h2>
            <div className="bg-white rounded-2xl p-2">
              <EquipmentsInRoom id={id} />
            </div>
          </div>

          {/* ปุ่มสลับฟอร์ม/ภาพ */}
          <div className="pt-2 mt-auto">
            <button
              onClick={() => setShowForm(!showForm)}
              className={`w-full py-3 sm:py-4 px-4 sm:px-6 text-white font-bold text-base sm:text-lg rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 flex items-center justify-center gap-2 sm:gap-3 ${
                showForm
                  ? "bg-gray-400 hover:bg-gray-500 shadow-gray-200 focus:ring-gray-200"
                  : "bg-orange-500 hover:bg-orange-600 shadow-orange-200 focus:ring-orange-200"
              }`}
            >
              {showForm ? (
                <>
                  <ArrowLeft className="w-5 sm:w-6 h-5 sm:h-6" /> <span className="hidden sm:inline">ยกเลิก / กลับไปดูรูปห้อง</span><span className="sm:hidden">ยกเลิก</span>
                </>
              ) : (
                <>
                  <CalendarCheck className="w-5 sm:w-6 h-5 sm:h-6" /> <span className="hidden sm:inline">จองห้องนี้เลย</span><span className="sm:hidden">จองเลย</span>
                  <Cat className="w-4 sm:w-5 h-4 sm:h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
