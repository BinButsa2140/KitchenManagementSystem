"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import BookingPage from "../booking/page";

const MyBooking = () => {
  const [booking, setBooking] = useState<BookingType[]>([]);
  const { data: session, status } = useSession();
  const route = useRouter();
  console.log(status, session);
  if (status === "authenticated" && session.user?.id) {
    console.log("session is ready", session);
  }
  async function fetchData() {
    //fetch booking data
    const id = session?.user?.id;
    if (!id) {
      console.log("no id");
      return;
    }
    try {
      const url = `/api/booking?user=${id}`;
      console.log("url = ", url);
      const res = await fetch(url);
      const data = await res.json();
      setBooking(data);
      console.log("res", data);
    } catch (error) {
      console.log(error);
    }
  }

  //delete booking
  function deleteBooking(booking_id){

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
        <div className="my-10 mx-5 md:mx-10 lg:mx-60">
          <div className="capitalize text-3xl">My Booking</div>
          <div className="flex flex-col my-10 gap-5">
            {booking.map((data, index) => {
              console.log(data.booking_id);
              const date = new Date(data.booking_time).toISOString().split('T')[0]
              return (
                <div
                  className="relative overflow-hidden group transition-all duration-300"
                  key={index}
                >
                  {/* Cancel Button (fixed behind the booking list) */}
                  <button
                    className="absolute right-0 top-0 h-full bg-red-500 text-white p-5 transition-all duration-300 transform translate-x-full group-hover:translate-x-0 z-10"
                  >
                    cancel
                  </button>

                  {/* Booking List Item */}
                  <div className="border-2 shadow-md p-5 w-full transition-all duration-300 group-hover:-translate-x-24 bg-white relative z-20">
                    <h2 className="">{date}</h2>
                    <h2 className="">room: {data.room_id}</h2>
                    <h2 className="">{data.booking_status}</h2>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
};
export default MyBooking;