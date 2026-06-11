import Link from "next/link";
import { ArrowRight, ChefHat, Sparkles } from "lucide-react";

export default function Home() {
  return (
    // กรอบด้านนอกสุด ให้มีระยะขอบนิดๆ (padding) เพื่อความโมเดิร์น
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      
      {/* Hero Container: ทำมุมโค้งมนขนาดใหญ่ (rounded-[2rem] หรือ [3rem])
        และซ่อนส่วนที่ล้นออก (overflow-hidden)
      */}
      <div className="relative w-full h-[80vh] min-h-[600px] rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl flex items-center justify-center text-center">
        
        {/* Background Image (ใช้รูปครัวสวยๆ แบบเดียวกับหน้า Login) */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1556910103-1c02745a872f?q=80&w=2070&auto=format&fit=crop')",
          }}
        ></div>

        {/* Overlay ไล่สีดำจางๆ เพื่อให้ตัวหนังสืออ่านง่าย */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80"></div>

        {/* Content: ตัวหนังสือและปุ่ม (อยู่บนสุด z-10) */}
        <div className="relative z-10 flex flex-col items-center px-6 max-w-4xl mx-auto">
          
          {/* Badge เล็กๆ ด้านบน */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-400/50 text-orange-100 backdrop-blur-sm mb-8">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-semibold tracking-wider uppercase">Welcome to Kitchen Hub</span>
          </div>

          {/* หัวข้อหลัก (Heading) */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
            Find Your <span className="text-orange-500">Perfect</span> Kitchen
          </h1>

          {/* คำอธิบายสั้นๆ (Sub-heading) */}
          <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl font-light drop-shadow-md">
            จองห้องครัวมาตรฐานระดับโปร ห้องเย็น หรือคลาสเรียนทำอาหารได้ง่ายๆ เริ่มต้นเนรมิตเมนูเด็ดของคุณได้เลยที่นี่!
          </p>

          {/* ปุ่ม Call to Action (CTA) */}
          <Link href="/room">
            <button className="group relative inline-flex items-center gap-3 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-full shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all duration-300 hover:-translate-y-1">
              <ChefHat className="w-6 h-6" />
              จองห้องเลยตอนนี้
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </Link>

        </div>
      </div>

    </div>
  );
}