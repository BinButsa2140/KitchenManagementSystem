"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { 
  Users, Plus, Edit, Trash2, X, Save, ChefHat, 
  Mail, Phone, ShieldCheck, UserCircle, Filter, Search
} from "lucide-react";
import { UserData } from "@/app/utils/models/user";

// --- Types ---


export default function UserManagementPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 🟢 State สำหรับค้นหาและกรอง (Search & Filter)
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // State สำหรับควบคุม Modal และฟอร์ม
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // State สำหรับเก็บข้อมูลในฟอร์ม
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    gender: "male",
    phone_number: "",
    email: "",
    password: "", 
    date_of_birth: "",
    user_type: "customer",
    user_status: "active",
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      toast.error("ไม่สามารถโหลดข้อมูลผู้ใช้งานได้");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🟢 ระบบค้นหาและกรองข้อมูลแบบ 2 ชั้น (ใช้ useMemo เพื่อลดการ Render ซ้ำซ้อน)
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // 1. กรองตามประเภท (Role) ก่อน
      const matchType = filterType === "all" ? true : user.user_type === filterType;
      
      // 2. กรองตามคำค้นหา (ชื่อ, นามสกุล, อีเมล, เบอร์โทร)
      const searchLower = searchQuery.toLowerCase().trim();
      const matchSearch = searchLower === "" || 
        user.firstname.toLowerCase().includes(searchLower) ||
        user.lastname.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone_number.includes(searchLower);

      return matchType && matchSearch;
    });
  }, [users, filterType, searchQuery]); // จะคำนวณใหม่เมื่อ 3 ค่านี้เปลี่ยนเท่านั้น

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      firstname: "", lastname: "", gender: "male",
      phone_number: "", email: "", password: "",
      date_of_birth: "", user_type: "customer", user_status: "active",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (user: UserData) => {
    setEditingId(user.user_id);
    setFormData({
      firstname: user.firstname,
      lastname: user.lastname,
      gender: user.gender || "male",
      phone_number: user.phone_number,
      email: user.email,
      password: "", 
      date_of_birth: new Date(user.date_of_birth).toISOString().split('T')[0],
      user_type: user.user_type,
      user_status: user.user_status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = editingId !== null;
    const url = isEditing ? `/api/users/${editingId}` : "/api/users";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "เกิดข้อผิดพลาด");
      }

      toast.success(isEditing ? "อัปเดตข้อมูลสำเร็จ!" : "เพิ่มผู้ใช้งานสำเร็จ!");
      setIsModalOpen(false);
      fetchUsers(); 
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะระงับสิทธิ์บัญชีนี้?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("ระงับสิทธิ์ไม่สำเร็จ");
      
      toast.success("ระงับสิทธิ์ผู้ใช้งานเรียบร้อย");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const renderRoleBadge = (type: string, isAdmin?: boolean) => {
    if (isAdmin) return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center w-fit gap-1"><ShieldCheck size={14}/> Admin</span>;
    if (type === 'chef') return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold flex items-center w-fit gap-1"><ChefHat size={14}/> Chef</span>;
    if (type === 'employee') return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center w-fit gap-1"><UserCircle size={14}/> Employee</span>;
    return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center w-fit gap-1"><Users size={14}/> Customer</span>;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 my-6 sm:my-10 bg-white rounded-3xl shadow-xl border border-gray-100">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 border-b border-gray-100 pb-5 gap-4 lg:gap-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl shrink-0">
            <Users size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">จัดการผู้ใช้งาน</h1>
            <p className="text-sm sm:text-base text-gray-500">จัดการบัญชีลูกค้า เชฟ และพนักงานทั้งหมด</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          
          {/* 🟢 Search Bar (ค้นหาด้วยข้อความ) */}
          <div className="flex items-center bg-gray-50 border border-gray-200 px-4 py-2 rounded-full focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-orange-400 transition-all w-full sm:w-64">
            <Search size={18} className="text-gray-400 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อ, อีเมล, เบอร์โทร..." 
              className="bg-transparent outline-none text-sm text-gray-700 w-full placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-red-500 ml-1 shrink-0">
                <X size={14} />
              </button>
            )}
          </div>

          {/* 🟢 Dropdown Filter (กรองตาม Role) */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-full w-full sm:w-auto hover:bg-gray-100 transition-colors">
            <Filter size={18} className="text-gray-500 shrink-0" />
            <select 
              className="bg-transparent outline-none text-sm font-semibold text-gray-700 cursor-pointer w-full"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">ทั้งหมด</option>
              <option value="customer">เฉพาะ ลูกค้า</option>
              <option value="chef">เฉพาะ เชฟ</option>
              <option value="employee">เฉพาะ พนักงาน</option>
            </select>
          </div>

          <button 
            onClick={handleAddNew}
            className="flex justify-center items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all shrink-0"
          >
            <Plus size={18} /> <span className="hidden sm:inline">เพิ่มผู้ใช้ใหม่</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      {isLoading ? (
        <div className="text-center py-20 text-orange-500 animate-pulse font-bold text-xl">
          กำลังโหลดข้อมูลผู้ใช้งาน...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="p-4 font-bold border-b whitespace-nowrap w-20">ID</th>
                <th className="p-4 font-bold border-b">ชื่อ-นามสกุล</th>
                <th className="p-4 font-bold border-b">ประเภท (Role)</th>
                <th className="p-4 font-bold border-b">ติดต่อ</th>
                <th className="p-4 font-bold border-b whitespace-nowrap">สถานะ</th>
                <th className="p-4 font-bold border-b text-center whitespace-nowrap">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Search size={40} className="mb-3 opacity-20" />
                      <p className="text-lg font-medium">ไม่พบข้อมูลผู้ใช้งาน</p>
                      <p className="text-sm mt-1">ลองเปลี่ยนคำค้นหาหรือตัวกรองใหม่</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.user_id} className="hover:bg-orange-50/50 transition-colors border-b last:border-0">
                    <td className="p-4 font-semibold text-gray-500">#{user.user_id}</td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{user.firstname} {user.lastname}</div>
                      <div className="text-xs text-gray-500 uppercase">{user.gender || '-'}</div>
                    </td>
                    <td className="p-4">
                      {renderRoleBadge(user.user_type, user.is_admin)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1"><Mail size={14} className="text-gray-400 shrink-0"/> {user.email}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-600"><Phone size={14} className="text-gray-400 shrink-0"/> {user.phone_number}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                        user.user_status === 'active' 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                      }`}>
                        {user.user_status}
                      </span>
                    </td>
                    <td className="p-4 text-center space-x-2 whitespace-nowrap">
                      <button onClick={() => handleEdit(user)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors" title="แก้ไข">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(user.user_id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={user.user_status === 'inactive'} title={user.user_status === 'inactive' ? "บัญชีนี้ถูกระงับแล้ว" : "ระงับสิทธิ์"}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 🟢 Modal สำหรับเพิ่ม/แก้ไข 🟢 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="bg-orange-50 p-5 sm:p-6 border-b border-orange-100 flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold text-orange-800 flex items-center gap-2">
                <Users /> {editingId ? "แก้ไขข้อมูลผู้ใช้งาน" : "เพิ่มบัญชีใหม่"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full p-1 shadow-sm">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ชื่อจริง</label>
                  <input type="text" required className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none" 
                    value={formData.firstname} onChange={e => setFormData({...formData, firstname: e.target.value})} />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">นามสกุล</label>
                  <input type="text" required className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none" 
                    value={formData.lastname} onChange={e => setFormData({...formData, lastname: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">อีเมล (ใช้สำหรับ Login)</label>
                  <input type="email" required className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none" 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    รหัสผ่าน {editingId && <span className="text-xs text-orange-500 font-normal">(เว้นว่างหากไม่เปลี่ยน)</span>}
                  </label>
                  <input type="password" required={!editingId} className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none" 
                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                  <input type="text" required className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none" 
                    value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">วันเกิด</label>
                  <input type="date" required className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none" 
                    value={formData.date_of_birth} onChange={e => setFormData({...formData, date_of_birth: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">เพศ</label>
                  <select className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none bg-white"
                    value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option value="male">ชาย (Male)</option>
                    <option value="female">หญิง (Female)</option>
                    <option value="other">อื่นๆ (Other)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ประเภทบัญชี (Role)</label>
                  <select className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none bg-white"
                    value={formData.user_type} onChange={e => setFormData({...formData, user_type: e.target.value})}>
                    <option value="customer">ลูกค้า (Customer)</option>
                    <option value="chef">เชฟ (Chef)</option>
                    <option value="employee">พนักงาน (Employee)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">สถานะ</label>
                  <select className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none bg-white"
                    value={formData.user_status} onChange={e => setFormData({...formData, user_status: e.target.value})}>
                    <option value="active">🟢 ปกติ (Active)</option>
                    <option value="inactive">🔴 ระงับสิทธิ์ (Inactive)</option>
                  </select>
                </div>

              </div>

              <div className="pt-6 mt-6 border-t flex flex-col-reverse sm:flex-row justify-end gap-3 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">
                  ยกเลิก
                </button>
                <button type="submit" className="w-full sm:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md flex justify-center items-center gap-2 transition-colors">
                  <Save size={20} /> บันทึกข้อมูล
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}