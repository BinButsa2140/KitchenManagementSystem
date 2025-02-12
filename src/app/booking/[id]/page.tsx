"use client";
import { useSession } from "next-auth/react";
import { NextRequest } from "next/server";
import { Room } from "@/app/utils/type";

const BookingPage = (req:NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const room_id = searchParams.get('room')
  const {data: session, status} = useSession()
  return(
    <div className="">
      {status == 'loading' && <p>loading</p>}
      {status=='authenticated' && (
        <div className="">
          {room_id}
        </div>
      )}
    </div>
  )
};

export default BookingPage;
