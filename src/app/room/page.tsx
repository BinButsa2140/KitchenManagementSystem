


import RoomCard from "@/components/Room/RoomCards";

// type Room = {
//   room_id:number;
//   room_name:string;
//   room_type:string;
// }

export default function RoomPage() {
  
  return (
    <div className="md:mx-52 my-5 grid grid-cols-2 border-2">
      <RoomCard/>
    </div>
  );
}
