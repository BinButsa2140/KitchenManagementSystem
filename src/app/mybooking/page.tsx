"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import BookingPage from "../booking/[id]/page";

import { format } from "date-fns";
import { th } from "date-fns/locale";
import { BookingType } from "../utils/models/Booking";

const MyBooking = () => {
  const [booking, setBooking] = useState<BookingType[]>([]);
  const { data: session, status } = useSession();
  const route = useRouter();

  async function fetchData() {
    const id = session?.user?.id;
    if(!id) return;
    try {
      const url = `/api/booking?user=${id}`;
      const res = await fetch(url);
      const data = await res.json();
      setBooking(data);
    } catch (error)  {
      console.log(error);
    }
  }
  
  useEffect(() => {
    if (status == "unauthenticated") {
      route.push("/signin");
    }
    if (session) {
      fetchData();
    }
  }, [session, status]);

  if (status === "loading") return <div className="text-center my-20">Loading...</div>;

  if (session) {
    return (
      <div className="mx-4 sm:mx-8 lg:mx-52 my-8 sm:my-12 lg:my-20">
        <div className="capitalize text-2xl sm:text-3xl font-bold mb-6">รายการการจองของฉัน</div>
        <div className="flex flex-col gap-4 sm:gap-6 my-8 sm:my-10">
          {booking.length === 0 ? (
            <p className="text-gray-500 text-center">ยังไม่มีรายการจอง</p>
          ) : (
            booking.map((data, index) => {
              const start = new Date(data.start_time);
              const end = new Date(data.end_time);
              return (
                <Link href={`/booking/${data.booking_id}`} key={index} className="border border-gray-200 p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition-all bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-gray-800">
                        {data.room?.room_name || `ห้อง #${data.room_id}`}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        วันที่: {format(start, "d MMMM yyyy", { locale: th })}
                      </p>
                      <p className="text-sm text-gray-600">
                        เวลา: {format(start, "HH:mm")} - {format(end, "HH:mm")} น.
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      data.booking_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {data.booking_status === 'active' ? 'ยืนยันแล้ว' : data.booking_status}
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    );
  }
  return null;
};
export default MyBooking;
