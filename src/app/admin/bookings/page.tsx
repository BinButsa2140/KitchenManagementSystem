"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { 
  CalendarDays, Filter, Search, X, CheckCircle, XCircle, Clock
} from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { BookingType } from "@/app/utils/models/Booking";

// Extended Type to include User info from the new API
type AdminBookingType = BookingType & {
  user?: {
    firstname: string;
    lastname: string;
    email: string;
    phone_number: string;
  };
};

export default function ManageBookingPage() {
  const [bookings, setBookings] = useState<AdminBookingType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State สำหรับค้นหาและกรอง
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/booking?all=true");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      toast.error("ไม่สามารถโหลดข้อมูลการจองได้");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ที่จะเปลี่ยนสถานะเป็น ${newStatus}?`)) return;

    try {
      const res = await fetch(`/api/booking/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_status: newStatus }),
      });

      if (!res.ok) throw new Error("อัปเดตสถานะไม่สำเร็จ");
      
      toast.success("อัปเดตสถานะเรียบร้อย");
      fetchBookings(); // รีเฟรชข้อมูลหลังจากอัปเดต
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // ระบบค้นหาและกรองข้อมูล
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // 1. กรองตามสถานะ
      const matchStatus = filterStatus === "all" ? true : booking.booking_status === filterStatus;
      
      // 2. กรองตามคำค้นหา
      const searchLower = searchQuery.toLowerCase().trim();
      const matchSearch = searchLower === "" || 
        booking.user?.firstname.toLowerCase().includes(searchLower) ||
        booking.user?.lastname.toLowerCase().includes(searchLower) ||
        booking.user?.email.toLowerCase().includes(searchLower) ||
        booking.room?.room_name.toLowerCase().includes(searchLower);

      return matchStatus && matchSearch;
    });
  }, [bookings, filterStatus, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 my-6 sm:my-10 bg-white rounded-3xl shadow-xl border border-gray-100">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 border-b border-gray-100 pb-5 gap-4 lg:gap-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl shrink-0">
            <CalendarDays size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">จัดการการจอง</h1>
            <p className="text-sm sm:text-base text-gray-500">ตรวจสอบและอัปเดตสถานะการเข้าใช้งานห้องครัว</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          
          {/* Search Bar */}
          <div className="flex items-center bg-gray-50 border border-gray-200 px-4 py-2 rounded-full focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-orange-400 transition-all w-full sm:w-64">
            <Search size={18} className="text-gray-400 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อผู้จอง, ห้อง..." 
              className="bg-transparent outline-none text-sm text-gray-700 w-full placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-red-500 ml-1 shrink-0">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Dropdown Filter */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-full w-full sm:w-auto hover:bg-gray-100 transition-colors">
            <Filter size={18} className="text-gray-500 shrink-0" />
            <select 
              className="bg-transparent outline-none text-sm font-semibold text-gray-700 cursor-pointer w-full"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="active">🟢 ยืนยันแล้ว (Active)</option>
              <option value="inactive">🔴 ยกเลิก/ระงับ (Inactive)</option>
              <option value="cancelled">⚫️ ยกเลิกโดยผู้ใช้ (Cancelled)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      {isLoading ? (
        <div className="text-center py-20 text-orange-500 animate-pulse font-bold text-xl">
          กำลังโหลดข้อมูลการจอง...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="p-4 font-bold border-b whitespace-nowrap w-24">Booking ID</th>
                <th className="p-4 font-bold border-b">ผู้จอง</th>
                <th className="p-4 font-bold border-b">ห้องที่จอง</th>
                <th className="p-4 font-bold border-b">วันและเวลา</th>
                <th className="p-4 font-bold border-b whitespace-nowrap">สถานะ</th>
                <th className="p-4 font-bold border-b text-center whitespace-nowrap">เปลี่ยนสถานะ</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Search size={40} className="mb-3 opacity-20" />
                      <p className="text-lg font-medium">ไม่พบข้อมูลการจอง</p>
                      <p className="text-sm mt-1">ลองเปลี่ยนคำค้นหาหรือตัวกรองใหม่</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const start = new Date(booking.start_time);
                  const end = new Date(booking.end_time);

                  return (
                    <tr key={booking.booking_id} className="hover:bg-orange-50/50 transition-colors border-b last:border-0">
                      <td className="p-4 font-semibold text-gray-500">#{booking.booking_id}</td>
                      <td className="p-4">
                        <div className="font-bold text-gray-800">{booking.user?.firstname} {booking.user?.lastname}</div>
                        <div className="text-xs text-gray-500">{booking.user?.email}</div>
                        <div className="text-xs text-gray-500">{booking.user?.phone_number}</div>
                      </td>
                      <td className="p-4 font-bold text-orange-600">
                        {booking.room?.room_name || `ห้อง ID: ${booking.room_id}`}
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-semibold text-gray-800">
                          {format(start, "d MMM yyyy", { locale: th })}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Clock size={12} /> {format(start, "HH:mm")} - {format(end, "HH:mm")} น.
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                          booking.booking_status === 'active' ? "bg-green-100 text-green-700" : 
                          booking.booking_status === 'cancelled' ? "bg-gray-100 text-gray-600" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {booking.booking_status === 'active' ? 'ยืนยันแล้ว' : booking.booking_status}
                        </span>
                      </td>
                      <td className="p-4 text-center space-x-2 whitespace-nowrap">
                        <button 
                          onClick={() => handleUpdateStatus(booking.booking_id, 'active')}
                          disabled={booking.booking_status === 'active'}
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                          title="ยืนยัน / กำลังใช้งาน (Active)"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(booking.booking_id, 'inactive')}
                          disabled={booking.booking_status === 'inactive'}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                          title="ระงับ / ไม่อนุมัติ (Inactive)"
                        >
                          <XCircle size={18} />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(booking.booking_id, 'cancelled')}
                          disabled={booking.booking_status === 'cancelled'}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                          title="ยกเลิก (Cancelled)"
                        >
                          <X size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
