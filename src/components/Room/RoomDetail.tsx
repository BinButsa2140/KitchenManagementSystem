"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import EquipmentsInRoom from "./EquipmentsInRoom";
import { fetchRoomData } from "@/app/utils/fetchRoom";
import { BookingForm } from "../BookForm/BookForm";
import { Room } from "@/app/utils/type";


export function RoomDetail({ id }: { id: string }) {
  const [roomData, setRoomData] = useState<Room | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [showForm, setShowForm] = useState(false);
  

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchRoomData(id);
      setRoomData(data);
    };
    fetchData();
  }, []);

  if (!isVisible || !roomData) return null;

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden p-6 space-y-6">
      <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6 border-b pb-3">
        {roomData.room_name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Section */}
        {showForm ? (
          <BookingForm room_id={id}/>
        ) : (
          roomData.image && (
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-lg">
              <Image
                src={roomData.image}
                alt={roomData.room_name || "Room Image"} // Fallback for alt text
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          )
        )}
        {/* Text Section */}
        <div className="flex flex-col space-y-6">
          <div>
            <p className="text-sm sm:text-base md:text-lg text-gray-600">
              <span className="font-semibold text-gray-800">Room Type:</span>
              <span className="ml-2 text-gray-700">{roomData.room_type}</span>
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-base sm:text-lg text-gray-800 mb-3">
              Description:
            </h2>
            <p className="text-gray-700 text-sm sm:text-base">
              {roomData.description}
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-base sm:text-lg text-gray-800">
              Equipments
            </h2>
            <EquipmentsInRoom id={id} />
          </div>

          <div className="mt-6">
            <button
            onClick={e=>(setShowForm(!showForm))} 
            className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300">
              Book This Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
