
"use client";

import { useState } from "react";
import { useRouter } from "next/router";

export type Room = {
  room_id: number;
  room_name: string;
  room_type: string;
  description: string;
  image: string;
};

const BookingPage = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [bookingTime, setBookingTime] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { id } = router.query;

  // Fetch room details on page load
  useState(() => {
    if (id) {
      fetch(`/api/room/${id}`)
        .then((res) => res.json())
        .then((data) => setRoom(data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room_id: room?.room_id,
          booking_time: bookingTime,
        }),
      });

      if (response.ok) {
        alert("Booking successful!");
        router.push("/thank-you");
      } else {
        alert("Failed to book the room.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {room ? (
        <div>
          <h1>{room.room_name}</h1>
          <img src={room.image} alt={room.room_name} width="400" />
          <p>{room.description}</p>
          <form onSubmit={handleBooking}>
            <label>
              Booking Time:
              <input
                type="datetime-local"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                required
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? "Booking..." : "Book Now"}
            </button>
          </form>
        </div>
      ) : (
        <p>Loading room details...</p>
      )}
    </div>
  );
};

export default BookingPage;
