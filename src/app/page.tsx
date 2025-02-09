'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

type Room = {
  room_id: Number;
  room_name: String;
  room_type: String;
};

export default function Home() {
  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: "url('/kitchen-background.jpg')", // Add a kitchen-themed background image
        }}
      >
        <div className="text-center bg-white bg-opacity-90 p-10 rounded-lg shadow-2xl max-w-2xl mx-5">
          <h1 className="text-5xl font-bold text-orange-600 mb-6">
            Find Your Perfect Kitchen
          </h1>
          <p className="text-gray-700 text-lg mb-8">
            Discover the ideal kitchen space for your culinary adventures. Book
            now and start cooking in a kitchen designed just for you!
          </p>
          <Link href="/room">
            <button className="bg-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Book Now
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}