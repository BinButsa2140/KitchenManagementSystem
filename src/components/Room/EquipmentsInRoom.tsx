'use client';

import { equipmentdata } from "@/app/utils/equipmentdata";
import { useEffect, useState } from "react"

type Equipment = {
    equipment_id: number;
    equipment_name: string;
    room_id: number;
    created_at: string;
    edited_at: string;
    employee_id: number;
    price: number;
    number: number;
};

const EquipmentsInRoom = ({ id }: { id: string }) => {
    const [equipments, setEquipments] = useState<Equipment[]>([]); // ✅ Fix here

    useEffect(() => {
        fetchData();
    }, [id]);

    async function fetchData() {
        const edata = await equipmentdata({ id, search: '' });

        if (Array.isArray(edata)) { // ✅ Ensure it's an array
            setEquipments(edata);
        } else {
            console.error("Expected an array but got:", edata);
        }
    }

    return (
        <>
            {equipments.map((data, index) => (
                <div className="ms-5" key={index}>
                    <h1>{data.equipment_name} <span> x {data.number}</span></h1>
                </div>
            ))}
        </>
    );
};

export default EquipmentsInRoom;
