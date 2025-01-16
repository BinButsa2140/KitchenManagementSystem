'use client';

import { equipmentdata } from "@/app/utils/equipmentdata";
import { useEffect, useState } from "react"

type Equipment = {
    equipment_id: number; // Unique identifier for the equipment
    equipment_name: string; // Name of the equipment
    room_id: number; // Associated room ID
    created_at: string; // Timestamp for when the equipment was created
    edited_at: string; // Timestamp for when the equipment was last edited
    employee_id: number; // ID of the employee managing the equipment
    price: number; // Price of the equipment
    number: number; // Quantity or count of the equipment
  };
  

const EquipmentsInRoom = ({ id }: { id: string }) => {
    
    const [equipments, setEquipments] = useState<Equipment>([])

    useEffect(()=>{
        fetchData()
    },[id])

    async function fetchData(){
        const edata = await equipmentdata({
            id:id,
            search:''
        })
        setEquipments(edata);
    }

  return (
    <>
        {
            equipments.map((data, index)=>{
                return(
                    <div className="ms-5" key={index}>
                        <h1 className="">{data.equipment_name} <span> x {data.number}</span></h1>
                    </div>
                )
            })
        }
    </>
  )
}
export default EquipmentsInRoom