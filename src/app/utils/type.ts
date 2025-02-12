export type BookingType = {
    booking_id: number;
    customer_id: number;
    room_id: number;
    booking_time: string;
    booking_status: string;
    create_at: string;
    edit_at: string;
  };
export type Room = {
    room_id: number;
    room_name: string;
    room_type: string;
    description: string;
    image: string;
  };

export type BookForm={
  room_id:number;
  user_id:number;
  booking_time:Date;
}