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
        <div className="mx-52 my-20">
          <div className="capitalize text-3xl">My Booking</div>
          <div className="flex flex-col my-10 ">
            {booking.map((data, index) => {
              console.log(data.booking_id);
              return (
                <Link href={`/booking/${data.booking_id}`} key={index} className="border p-5 shadow-md">
                  <h2 className="">{data.booking_time}</h2>
                  <h2 className="">room: {data.room_id}</h2>
                  <h2 className="">{data.booking_status}</h2>
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
