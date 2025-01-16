"use client";

import { listRooms } from "@/app/utils/room";
import { useEffect, useState } from "react";
import Link from "next/link";

type Room = {
  room_id: number;
  room_name: string;
  room_type: string;
};

export default function RoomCard() {
  useEffect(() => {
    fetchData();
  }, []);
  const [room, setRoom] = useState<Room[]>([]);
  async function fetchData() {
    const response = await listRooms();
    setRoom(response);
  }

  return (
    <>
      {room.map((data, index) => {
        return (
          <div className="p-10 border hover:shadow-md" key={index}>
            <Link href={`/room/${data.room_id}`}>
              <h1 className="text-xl font-bold">{data.room_name}</h1>
              <h1 className="text-xs">{data.room_type}</h1>
            </Link>
          </div>
        );
      })}
    </>
  );
}
