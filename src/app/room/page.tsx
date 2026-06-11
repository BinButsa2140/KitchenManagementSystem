import RoomCard from "@/components/Room/RoomCards";

export default function RoomPage() {
  return (
    // เปลี่ยนมาใช้ max-w-7xl เพื่อจำกัดความกว้างสูงสุด และ mx-auto เพื่อให้อยู่ตรงกลางจอ
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      
      {/* เพิ่มหัวข้อเพจให้ดูมีอะไรมากขึ้น */}
      <div className="mb-6 sm:mb-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">
          เลือกห้องที่คุณต้องการ <span className="text-orange-500">🍳</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">จองห้องครัว ห้องเย็น หรือคลาสเรียนทำอาหารได้เลยที่นี่</p>
      </div>

      {/* เรียกใช้งาน Card */}
      <RoomCard />
      
    </div>
  );
}