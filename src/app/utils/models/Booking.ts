export type BookingType = {
  booking_id: number;
  user_id: number; // แก้ไขจาก customer_id -> user_id
  room_id: number;
  booking_time: string;
  booking_status: "active" | "inactive" | "cancelled";
  created_at: string;
  edited_at: string;
};

export type BookForm = {
  room_id: number;
  user_id: number;
  booking_time: Date;
};