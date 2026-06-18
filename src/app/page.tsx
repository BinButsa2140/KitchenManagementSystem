'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChefHat, Sparkles, CookingPot, Clock, Users, Star, MapPin, Loader2 } from "lucide-react";

interface Room {
  room_id: number;
  room_name: string;
  room_type: string;
  image: string | null;
  description: string | null;
}

interface Recipe {
  recipe_id: number;
  title: string;
  image: string | null;
  created_at: string;
}

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [featuredRecipe, setFeaturedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, recipesRes] = await Promise.all([
          fetch("/api/rooms"),
          fetch("/api/recipes")
        ]);

        if (roomsRes.ok) {
          const roomsData = await roomsRes.json();
          setRooms(roomsData.slice(0, 4)); // Show top 4 kitchens
        }

        if (recipesRes.ok) {
          const recipesData = await recipesRes.json();
          if (recipesData.length > 0) {
            setFeaturedRecipe(recipesData[0]); // Show the latest recipe
          }
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* ===== MAIN BENTO GRID ===== */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto">

        {/* ----- HERO CARD (large, spans 3 cols, 2 rows on desktop) ----- */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl lg:col-span-3 lg:row-span-2 min-h-[600px] group">
          {/* Background image – warm chef action shot */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] group-hover:scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2070&auto=format&fit=crop')",
            }}
          />
          {/* Orange‑toned gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-orange-900/20 via-orange-900/40 to-orange-950/85" />
          {/* Subtle tile texture */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/white-tiles.png')]" />

          {/* Floating food icons */}
          <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
            <span className="absolute top-[15%] left-[10%] text-4xl animate-float-slow">🍳</span>
            <span className="absolute top-[25%] right-[15%] text-5xl animate-float-medium">🥑</span>
            <span className="absolute bottom-[20%] left-[20%] text-3xl animate-float-fast">🌿</span>
            <span className="absolute bottom-[15%] right-[10%] text-6xl animate-float-slow">🍲</span>
          </div>

          {/* Hero text & CTA */}
          <div className="relative z-20 flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500/25 border border-orange-400/50 text-orange-100 backdrop-blur-md mb-6 animate-pulse-glow">
              <Sparkles className="w-4 h-4 text-orange-300" />
              <span className="text-sm font-semibold tracking-wider uppercase">Welcome to Kitchen Hub</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-2xl leading-tight">
              Find Your <span className="text-orange-400">Perfect</span> Kitchen
            </h1>
            <p className="text-base md:text-xl text-orange-50/90 mb-8 max-w-xl font-light drop-shadow-md">
              จองห้องครัวมาตรฐานระดับโปร ห้องเย็น หรือคลาสเรียนทำอาหารได้ง่าย ๆ เริ่มต้นเนรมิตเมนูเด็ดของคุณได้เลยที่นี่!
            </p>
            <Link href="/room">
              <button className="group relative inline-flex items-center gap-3 px-8 py-4 bg-orange-500 hover:bg-orange-400 text-white font-bold text-lg rounded-full shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:shadow-[0_0_45px_rgba(249,115,22,0.7)] transition-all duration-300 hover:-translate-y-1 active:scale-95">
                <ChefHat className="w-6 h-6" />
                จองห้องเลยตอนนี้
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
            </Link>
          </div>
        </div>

        {/* ----- SIDE CARD: Featured Recipe ----- */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl group min-h-[280px] lg:col-span-1">
          {featuredRecipe ? (
            <Link href={`/recipes/${featuredRecipe.recipe_id}`} className="block h-full">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: `url('${featuredRecipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop'}')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
                <span className="bg-orange-500 text-xs font-bold px-3 py-1 rounded-full self-start mb-3">
                  สูตรล่าสุด
                </span>
                <h3 className="text-2xl font-bold mb-1 line-clamp-2">{featuredRecipe.title}</h3>
                <p className="text-sm text-gray-200">
                  {new Date(featuredRecipe.created_at).toLocaleDateString("th-TH")}
                </p>
                <div className="mt-4 inline-flex items-center gap-1 text-orange-300 hover:text-orange-200 text-sm font-semibold">
                  ดูสูตรเต็ม <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-100 text-gray-400">
              ไม่มีสูตรอาหาร
            </div>
          )}
        </div>

        {/* ----- FEATURE CARDS (auto‑place in remaining grid cells) ----- */}
        <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
            <CookingPot className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">ครัวมืออาชีพ</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            อุปกรณ์ครบครัน มาตรฐานสูง รองรับทั้งมือใหม่และเซฟมือโปร
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
            <Clock className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">จองง่าย จ่ายสะดวก</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            เลือกเวลา จ่ายออนไลน์ จองเสร็จใน 2 นาที พร้อมใช้งานทันที
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
            <Users className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">คลาส & เวิร์คช็อป</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            เรียนรู้จากเชฟชื่อดัง สนุกกับทำอาหารในบรรยากาศกันเอง
          </p>
        </div>

        {/* (Optional extra card for balance – grid auto‑fills here) */}
        <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl p-6 shadow-lg text-white flex flex-col justify-center items-center text-center">
          <Star className="w-8 h-8 mb-2 fill-white" />
          <p className="font-bold text-lg">4.9 / 5</p>
          <p className="text-sm text-orange-100">รีวิวจากผู้ใช้จริง</p>
        </div>
      </div>

      {/* ===== POPULAR KITCHENS / FOOD GALLERY (Bento‑style row below) ===== */}
      <div className="max-w-7xl mx-auto mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">ครัวยอดนิยม</h2>
          <Link href="/room" className="text-orange-600 hover:text-orange-700 font-semibold inline-flex items-center gap-1">
            ดูทั้งหมด <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <Link key={room.room_id} href={`/room/${room.room_id}`}>
                <div className="relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 group h-72">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${room.image || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop'}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <h4 className="font-bold text-lg">{room.room_name}</h4>
                    <p className="text-sm flex items-center gap-1 opacity-90 uppercase tracking-tighter">
                      <CookingPot className="w-4 h-4" /> {room.room_type}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-400">
              ไม่พบข้อมูลครัวในขณะนี้
            </div>
          )}
        </div>
      </div>

      {/* Custom animations (floating icons, badge glow) */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(-2deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(4deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(249,115,22,0.3); }
          50% { box-shadow: 0 0 25px rgba(249,115,22,0.5); }
        }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 5s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}