import { findRoom } from "./room";
import { Room } from "./type";


 export async function fetchRoomData(room_id:string) {
    try {
      const data = await findRoom(room_id);
      return(data)
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
    
  }