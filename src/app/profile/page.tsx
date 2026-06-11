"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LogOut, Mail, Fingerprint, ShieldCheck, UserCircle, ChefHat, Cat, Loader2 } from "lucide-react";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ดึงข้อมูลผู้ใช้ รวมถึง role และ isAdmin ที่เราเพิ่งเพิ่มเข้าไป
  const { name, email, id, role, isAdmin } = (session?.user as any) || {};

  // จัดการ Redirect อย่างถูกต้องผ่าน useEffect
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  // หน้า Loading สไตล์ Kitchen Hub
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="flex flex-col items-center text-orange-400">
          <Loader2 className="h-12 w-12 animate-spin mb-4" strokeWidth={2.5} />
          <p className="font-medium flex items-center gap-2 animate-pulse">
            <Cat className="w-5 h-5" /> กำลังตรวจสอบโปรไฟล์...
          </p>
        </div>
      </div>
    );
  }

  // ป้องกันการเรนเดอร์หน้าขาวก่อนที่จะ Redirect
  if (!session) return null; 

  // ฟังก์ชันช่วยสร้างป้ายบอกสถานะผู้ใช้ (Badge)
  const renderRoleBadge = () => {
    if (isAdmin) return <span className="bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 shadow-sm border border-red-200"><ShieldCheck className="w-4 h-4"/> System Admin</span>;
    if (role === 'chef') return <span className="bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 shadow-sm border border-orange-200"><ChefHat className="w-4 h-4"/> Chef</span>;
    if (role === 'employee') return <span className="bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 shadow-sm border border-blue-200"><UserCircle className="w-4 h-4"/> Staff</span>;
    return <span className="bg-green-100 text-green-600 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 shadow-sm border border-green-200">Customer</span>;
  };

  return (
    <div className="min-h-[85vh] flex justify-center items-center bg-gray-50/50 p-4">
      
      {/* การ์ด Profile แบบ Modern */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-8 w-full max-w-md relative overflow-hidden">
        
        {/* แถบสีตกแต่งด้านบน */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600"></div>

        {/* รูปโปรไฟล์ตรงกลาง */}
        <div className="relative flex justify-center mt-8 mb-4">
          <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-white z-10 text-orange-400">
            {role === 'chef' ? <ChefHat size={60} strokeWidth={1.5} /> : <UserCircle size={70} strokeWidth={1.5} />}
          </div>
        </div>

        {/* ชื่อ และ Badge */}
        <div className="text-center mb-8 relative z-10 mt-2">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-3">{name || "Kitchen User"}</h1>
          <div className="flex justify-center mb-4">
            {renderRoleBadge()}
          </div>
        </div>

        {/* กล่องข้อมูล */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4 bg-orange-50/70 p-4 rounded-2xl border border-orange-100/50 hover:bg-orange-50 transition-colors">
            <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Email Address</p>
              <p className="text-gray-800 font-medium">{email || "ไม่พบข้อมูลอีเมล"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-orange-50/70 p-4 rounded-2xl border border-orange-100/50 hover:bg-orange-50 transition-colors">
            <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Account ID</p>
              <p className="text-gray-800 font-medium">#{id || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* ปุ่ม Logout */}
        <button
          onClick={() => signOut({ callbackUrl: '/signin' })}
          className="w-full py-4 px-6 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 font-bold rounded-2xl transition-all duration-300 flex justify-center items-center gap-3 group border border-red-100 hover:border-red-500 shadow-sm hover:shadow-md"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          ออกจากระบบ (Logout)
        </button>

      </div>
    </div>
  );
};

export default ProfilePage;