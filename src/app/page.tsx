'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

type Room = {
  room_id:Number;
  room_name:String;
  room_type:String;
}
 

export default function Home() {
      return(
        <>
          <div className="h-min-min-h-screen mx-10 my-3 shadow-md" >
              <div className="hero p-52 flex flex-col items-center h-auto">
                    <div className="p-5 text-4xl font-bold text-center">
                    Find your kitchen
                    </div> 
                    <div className="mb-5">
                      book blablabla
                    </div>
                    <Link
                    href="/room"
                    >
                      <button className="border p-5">book now</button>
                    </Link>
              </div> 
          </div>
        </>
      )
}
