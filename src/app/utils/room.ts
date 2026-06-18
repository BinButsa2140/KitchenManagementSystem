
type Room = {
  room_id: number;
  room_name: string;
  room_type: string;
};

export async function listRooms() {
    const url = "/api/rooms"
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Failed to fetch rooms: ${response.statusText}`)
    }
    const data:Room[] = await response.json()
    return data
}

export async function findRoom(id:string){
  const url = `/api/rooms/${id}`
  const response = await fetch(url)
  if (!response.ok) {
      throw new Error(`Failed to fetch room: ${response.statusText}`)
  }
  const data = await response.json()
  return data
}
