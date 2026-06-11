"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import UserMenu from './UserMenu';
import { links } from "@/app/utils/links";
import { ShieldCheck } from "lucide-react"; // แนะนำให้ลง lucide-react ไว้ใช้ทำไอคอนสวยๆ

const Navbar = () => {
  const { data: session } = useSession();
  
  // เช็คว่า User ล็อกอินอยู่และมีสิทธิ์เป็น Admin หรือไม่
  const isAdmin = (session?.user as any)?.isAdmin;

  // รายการเมนูเฉพาะ Admin (คุณสามารถเปลี่ยน Path ให้ตรงกับที่คุณสร้างไว้ได้เลย)
  const adminLinks = [
    { href: "/admin/dashboard", title: "Dashboard" },
    { href: "/admin/employees", title: "Employees" },
    { href: "/admin/users", title: "Users" },
    { href: "/admin/bookings", title: "Manage Bookings" },
  ];

  return (
    <header className="py-3 sm:py-4 px-4 sm:px-6 lg:px-8 bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link 
          href="/" 
          aria-label="Homepage" 
          className="text-lg sm:text-xl lg:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400 flex items-center gap-1 sm:gap-2"
        >
          <span>🍳</span> <span className="hidden sm:inline">Kitchen Hub</span><span className="sm:hidden">Hub</span>
        </Link>
        
        {/* Navigation */}
        <nav className="overflow-x-auto">
          <ul className="flex gap-3 sm:gap-6 lg:gap-8 items-center text-xs sm:text-sm lg:text-base text-gray-600 font-medium whitespace-nowrap">
            
            {/* เมนูทั่วไป (สำหรับลูกค้าทุกคน) */}
            {links.map((data, index) => (
              <li key={`user-${index}`}>
                <Link 
                  href={data.href} 
                  aria-label={data.title}
                  className="hover:text-orange-600 transition-all duration-200 border-b-2 border-transparent hover:border-orange-600 pb-1"
                >
                  {data.title}
                </Link>
              </li>
            ))}

            {/* 🔴 เมนูพิเศษเฉพาะ Admin (จะแสดงก็ต่อเมื่อ isAdmin = true เท่านั้น) */}
            {isAdmin && (
              <div className="flex items-center gap-3 sm:gap-6 lg:gap-8 border-l-2 border-red-100 pl-3 sm:pl-6 ml-1 sm:ml-2">
                {/* Badge บอกสถานะว่าเป็นโซนแอดมิน (ซ่อนในมือถือกันรก) */}
                <span className="hidden lg:flex items-center gap-1 text-red-500 text-xs font-bold uppercase bg-red-50 px-2 py-1 rounded-md">
                  <ShieldCheck size={14} /> Admin
                </span>

                {adminLinks.map((data, index) => (
                  <li key={`admin-${index}`}>
                    <Link 
                      href={data.href} 
                      aria-label={data.title}
                      className="text-red-600 hover:text-red-800 transition-all duration-200 border-b-2 border-transparent hover:border-red-600 pb-1 font-semibold"
                    >
                      {data.title}
                    </Link>
                  </li>
                ))}
              </div>
            )}
            
            {/* User Menu */}
            {/* เพิ่มเส้นคั่นด้านซ้ายเพื่อให้ดูแยกสัดส่วนชัดเจน */}
            <li className="ml-2 pl-4 sm:pl-6 border-l-2 border-gray-100">
              <UserMenu />
            </li>
          </ul>
        </nav>
        
      </div>
    </header>
  );
};

export default Navbar;