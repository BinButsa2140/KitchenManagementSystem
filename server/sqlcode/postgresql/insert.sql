-- 1. สร้าง Departments (แผนก)
INSERT INTO "Departments" (department_name, rate) 
VALUES
('Kitchen Operations', 500.00),
('Administration', 350.00);

-- 2. สร้าง Customers (ลูกค้า/เชฟ)
INSERT INTO "Customers" (firstname, lastname, date_of_birth, customer_type, email, password, phone_number) 
VALUES
('Gordon', 'Ramsay', '1966-11-08 00:00:00', 'chef', 'gordon.r@example.com', 'hashed_pass_123', '0833333333'),
('Alice', 'Wonder', '2000-01-10 00:00:00', 'customer', 'alice.w@example.com', 'hashed_pass_456', '0844444444');

-- 3. สร้าง Employees (พนักงาน)
-- สมมติว่า department_id 1 คือ Kitchen และ 2 คือ Admin ตามที่เพิ่ง Insert ไปด้านบน
INSERT INTO "Employees" (firstname, lastname, gender, phone_number, email, password, date_of_birth, department_id, employee_status) 
VALUES
('Somchai', 'Jaidee', 'male', '0811111111', 'somchai@kitchenhub.com', 'pass_123', '1990-05-15 00:00:00', 1, 'active'),
('Somsri', 'Rakdee', 'female', '0822222222', 'somsri@kitchenhub.com', 'pass_456', '1995-08-20 00:00:00', 2, 'active');

-- 4. สร้าง Rooms (ห้อง)
INSERT INTO "Rooms" (room_name, description, image, room_type) 
VALUES
('Main Kitchen A', 'ห้องครัวหลักขนาดใหญ่ อุปกรณ์ครบครัน', 'https://images.unsplash.com/photo-1556910103-1c02745a872f', 'kitchen'),
('Cold Storage 1', 'ห้องเย็นสำหรับเก็บวัตถุดิบ', 'https://images.unsplash.com/photo-1578916171728-46686eac8d58', 'storage'),
('Baking Masterclass Room', 'ห้องสำหรับสอนทำขนมอบ', 'https://images.unsplash.com/photo-1581349485608-9469926a8e5e', 'course');

-- 5. เชื่อม Employees กับ Rooms (ตารางความสัมพันธ์ Many-to-Many ของ Prisma)
-- A คือ employee_id, B คือ room_id
INSERT INTO "_EmployeesToRooms" ("A", "B") 
VALUES
(1, 1), -- พนักงานคนที่ 1 ดูแลห้องที่ 1
(2, 3); -- พนักงานคนที่ 2 ดูแลห้องที่ 3

-- 6. สร้าง Equipments (อุปกรณ์)
-- ผูกกับ room_id และ employee_id
INSERT INTO "Equipments" (equipment_name, room_id, employee_id, price, number) 
VALUES
('Professional Stand Mixer', 1, 1, 15000, 2),
('Chef Knife Set', 1, 1, 5000, 5),
('Industrial Oven', 3, 2, 45000, 1);

-- 7. สร้าง Bookings (การจอง)
-- ผูกกับ customer_id และ room_id
INSERT INTO "Bookings" (customer_id, room_id, booking_time, booking_status) 
VALUES
(1, 1, '2026-06-15 09:00:00', 'active'),
(2, 3, '2026-06-20 13:00:00', 'active');