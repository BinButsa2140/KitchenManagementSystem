export type Room = {
  room_id: number;
  room_name: string;
  room_type: "kitchen" | "storage" | "course";
  description: string | null;
  image: string | null;
};