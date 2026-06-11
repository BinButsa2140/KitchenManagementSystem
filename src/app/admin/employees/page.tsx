"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { 
  Users, Plus, Edit, Trash2, X, Save, ChefHat, 
  Mail, Phone, Calendar, User, ShieldAlert
} from "lucide-react";
import { Employee } from "@/app/utils/models/employee";

// --- Types ---


export default function EmployeeManagementPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
    password: "", // รหัสผ่านจะส่งไปเฉพาะตอนสร้างใหม่ หรือตอนที่อยากเปลี่ยน
    date_of_birth: "",
    employee_status: "active",
  });

  // 🟢 โหลดข้อมูลพนักงานทั้งหมด
  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      toast.error("ไม่สามารถโหลดข้อมูลพนักงานได้");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 🟢 เปิดฟอร์มสำหรับ "เพิ่มพนักงานใหม่"
  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      firstname: "", lastname: "", gender: "male",
      phone_number: "", email: "", password: "",
      date_of_birth: "", employee_status: "active",
    });
    setIsModalOpen(true);
  };

  // 🟢 เปิดฟอร์มสำหรับ "แก้ไขพนักงาน"
  const handleEdit = (emp: Employee) => {
    setEditingId(emp.employee_id);
    setFormData({
      firstname: emp.firstname,
      lastname: emp.lastname,
      gender: emp.gender,
      phone_number: emp.phone_number,
      email: emp.email,
      password: "", // เว้นว่างไว้ ถ้ายูสเซอร์ไม่พิมพ์ใหม่ก็คือใช้รหัสเดิม
      date_of_birth: new Date(emp.date_of_birth).toISOString().split('T')[0], // แปลงให้เข้ากับ input type="date"
      employee_status: emp.employee_status,
    });
    setIsModalOpen(true);
  };

  // 🟢 กดปุ่มบันทึก (ทั้งสร้างและแก้ไข)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = editingId !== null;
    const url = isEditing ? `/api/employees/${editingId}` : "/api/employees";
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

      toast.success(isEditing ? "อัปเดตข้อมูลสำเร็จ!" : "เพิ่มพนักงานสำเร็จ!");
      setIsModalOpen(false);
      fetchEmployees(); // โหลดข้อมูลใหม่
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // 🟢 ระงับสิทธิ์ (Soft Delete)
  const handleDelete = async (id: number) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะระงับสิทธิ์พนักงานคนนี้?")) return;

    try {
      const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("ลบข้อมูลไม่สำเร็จ");
      
      toast.success("ระงับสิทธิ์พนักงานเรียบร้อย");
      fetchEmployees();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 my-10 bg-white rounded-3xl shadow-xl border border-gray-100">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-100 pb-5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
            <Users size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">จัดการพนักงาน</h1>
            <p className="text-gray-500">เพิ่ม ลบ แก้ไข ข้อมูลทีมงาน Kitchen Hub</p>
          </div>
        </div>
        <button 
          onClick={handleAddNew}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all"
        >
          <Plus size={20} /> เพิ่มพนักงานใหม่
        </button>
      </div>

      {/* Table Section */}
      {isLoading ? (
        <div className="text-center py-20 text-orange-500 animate-pulse font-bold text-xl">
          กำลังโหลดข้อมูลพนักงาน...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-700">
                <th className="p-4 font-bold border-b">ID</th>
                <th className="p-4 font-bold border-b">ชื่อ-นามสกุล</th>
                <th className="p-4 font-bold border-b">ติดต่อ</th>
                <th className="p-4 font-bold border-b">สถานะ</th>
                <th className="p-4 font-bold border-b text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">ยังไม่มีข้อมูลพนักงาน</td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.employee_id} className="hover:bg-orange-50/50 transition-colors border-b last:border-0">
                    <td className="p-4 font-semibold text-gray-600">#{emp.employee_id}</td>
                    <td className="p-4">
                      <div className="font-bold text-gray-800">{emp.firstname} {emp.lastname}</div>
                      <div className="text-xs text-gray-500 uppercase">{emp.gender}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600"><Mail size={14} /> {emp.email}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-600"><Phone size={14} /> {emp.phone_number}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                        emp.employee_status === 'active' 
                        ? "bg-green-100 text-green-700" 
                        : "bg-red-100 text-red-700"
                      }`}>
                        {emp.employee_status}
                      </span>
                    </td>
                    <td className="p-4 text-center space-x-2">
                      <button onClick={() => handleEdit(emp)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(emp.employee_id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" disabled={emp.employee_status === 'inactive'}>
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

      {/* 🟢 Modal สำหรับเพิ่ม/แก้ไขพนักงาน 🟢 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="bg-orange-50 p-6 border-b border-orange-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-orange-800 flex items-center gap-2">
                <ChefHat /> {editingId ? "แก้ไขข้อมูลพนักงาน" : "เพิ่มพนักงานใหม่"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={28} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
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
                    รหัสผ่าน {editingId && <span className="text-xs text-orange-500">(เว้นว่างไว้ถ้าไม่ต้องการเปลี่ยน)</span>}
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
                  <select className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none"
                    value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option value="male">ชาย (Male)</option>
                    <option value="female">หญิง (Female)</option>
                    <option value="other">อื่นๆ (Other)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">สถานะ</label>
                  <select className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none"
                    value={formData.employee_status} onChange={e => setFormData({...formData, employee_status: e.target.value})}>
                    <option value="active">🟢 ปฏิบัติงาน (Active)</option>
                    <option value="inactive">🔴 ระงับสิทธิ์ (Inactive)</option>
                  </select>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="pt-6 mt-4 border-t flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">
                  ยกเลิก
                </button>
                <button type="submit" className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md flex items-center gap-2 transition-colors">
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