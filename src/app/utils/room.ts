

type Room = {
  room_id: number;
  room_name: string;
  room_type: string;
};

export async function listRooms() {
    const url = "http://localhost:3000/api/rooms"
    const response = await fetch(url)
    const data:Room[] = await response.json()
    return data
}

export async function findRoom(id:string){
  const url = `http://localhost:3000/api/rooms/${id}`
  const response = await fetch(url)
  const data = await response.json()
  return data
}
