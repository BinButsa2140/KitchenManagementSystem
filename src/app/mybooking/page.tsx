"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import BookingPage from "../booking/[id]/page";

const MyBooking = () => {
  const [booking, setBooking] = useState<BookingType[]>([]);
  const { data: session, status } = useSession();
  const route = useRouter();
  console.log(status, session)
  if(status === 'authenticated'&&session.user?.id){
    console.log('session is ready', session)
  }
  async function fetchData() {//fetch booking data
    const id = session?.user?.id;
    if(!id) { 
      console.log("no id")
      return;
    }
    try {
      const url = `/api/booking?user=${id}`;
      console.log('url = ', url);
      const res = await fetch(url);
      const data = await res.json();
      setBooking(data);
      console.log("res", data);
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
  }, [session]);

  if (!session && status !== "loading") {
    toast.error("You must log in first");
    route.push("/signin");
    return null; // Prevent further rendering.
  }

  if (session) {
    return (
      <>
        <div className="mx-4 sm:mx-8 lg:mx-52 my-8 sm:my-12 lg:my-20">
          <div className="capitalize text-2xl sm:text-3xl font-bold mb-6">My Booking</div>
          <div className="flex flex-col gap-4 sm:gap-6 my-8 sm:my-10">
            {booking.map((data, index) => {
              console.log(data.booking_id);
              return (
                <Link href={`/booking/${data.booking_id}`} key={index} className="border border-gray-200 p-4 sm:p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h2 className="text-sm sm:text-base font-semibold text-gray-800">{data.booking_time}</h2>
                  <h2 className="text-xs sm:text-sm text-gray-600 mt-2">Room: {data.room_id}</h2>
                  <h2 className="text-xs sm:text-sm text-orange-600 font-medium mt-2">{data.booking_status}</h2>
                </Link>
              );
            })}
          </div>
        </div>
      </>
    );
  }
};
export default MyBooking;
