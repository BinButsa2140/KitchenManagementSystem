export type BookingType = {
  booking_id: number;
  user_id: number;
  room_id: number;
  start_time: string;
  end_time: string;
  total_price?: number;
  booking_status: "active" | "inactive" | "cancelled";
  created_at: string;
  edited_at: string;
  room?: {
    room_name: string;
    image?: string;
  };
};

export type BookForm = {
  room_id: number;
  user_id: number;
  start_time: Date;
  end_time: Date;
};