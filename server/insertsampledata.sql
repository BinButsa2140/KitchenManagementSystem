INSERT INTO Departments (department_name, rate, created_at, edited_at) VALUES
('Admin', 20.5, NOW(), NOW()),
('Kitchen', 25.0, NOW(), NOW()),
('Cleaning', 15.5, NOW(), NOW()),
('Reception', 18.0, NOW(), NOW()),
('Management', 30.0, NOW(), NOW());

INSERT INTO Customers (firstname, lastname, date_of_birth, customer_type, email, password, phone_number, created_at, edited_at) VALUES
('John', 'Doe', '1985-02-15', 'customer', 'john.doe@example.com', 'password123', '1234567890', NOW(), NOW()),
('Jane', 'Smith', '1990-07-22', 'customer', 'jane.smith@example.com', 'password456', '0987654321', NOW(), NOW()),
('Alice', 'Brown', '1995-05-10', 'chef', 'alice.brown@example.com', 'password789', '1111111111', NOW(), NOW()),
('Bob', 'White', '1982-11-30', 'customer', 'bob.white@example.com', 'password321', '2222222222', NOW(), NOW()),
('Emma', 'Green', '2000-03-12', 'chef', 'emma.green@example.com', 'password654', '3333333333', NOW(), NOW());

INSERT INTO Employees (firstname, lastname, gender, phone_number, email, password, date_of_birth, department_id, employee_status, created_at, edited_at) VALUES
('Michael', 'Johnson', 'male', '5550001111', 'michael.johnson@example.com', 'securepass1', '1990-01-01', 1, 'active', NOW(), NOW()),
('Sophia', 'Williams', 'female', '5550002222', 'sophia.williams@example.com', 'securepass2', '1985-06-15', 2, 'active', NOW(), NOW()),
('James', 'Brown', 'male', '5550003333', 'james.brown@example.com', 'securepass3', '1992-09-20', 3, 'inactive', NOW(), NOW()),
('Olivia', 'Davis', 'female', '5550004444', 'olivia.davis@example.com', 'securepass4', '1998-03-30', 4, 'active', NOW(), NOW()),
('Liam', 'Wilson', 'male', '5550005555', 'liam.wilson@example.com', 'securepass5', '1980-12-05', 5, 'inactive', NOW(), NOW());

INSERT INTO Rooms (room_name, room_type, description, image) VALUES
('Main Kitchen', 'kitchen', 'A fully equipped kitchen for culinary purposes.', 'https://plus.unsplash.com/premium_photo-1680382578857-c331ead9ed51?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Storage A', 'storage', 'Storage room for equipment and ingredients.', 'https://www.checkatrade.com/blog/wp-content/uploads/2023/10/kitchen-pantry-storage-containers.jpg'),
('Classroom 1', 'course', 'A classroom designed for cooking lessons.', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Classroom 2', 'course', 'Another classroom for additional courses.', 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=876&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
('Storage B', 'storage', 'Secondary storage room for additional supplies.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_iiYvvL22a9fCekuzxZTsXfegZjjZwv3vMQ&s');


INSERT INTO Bookings (customer_id, room_id, created_at, edited_at, booking_status, booking_time) VALUES
(1, 1, NOW(), NOW(), 'active', '2024-12-30 14:00:00'),  -- Customer 1 wants to use the room on 30th Dec at 2:00 PM
(2, 3, NOW(), NOW(), 'cancelled', '2024-12-27 10:00:00'),  -- Customer 2 wants to use the room on 27th Dec at 10:00 AM
(3, 2, NOW(), NOW(), 'active', '2024-12-28 15:00:00'),  -- Customer 3 wants to use the room on 28th Dec at 3:00 PM
(4, 4, NOW(), NOW(), 'inactive', '2024-12-29 11:00:00'),  -- Customer 4 wants to use the room on 29th Dec at 11:00 AM
(5, 5, NOW(), NOW(), 'active', '2024-12-31 16:00:00');  -- Customer 5 wants to use the room on 31st Dec at 4:00 PM



INSERT INTO Equipments (equipment_name, room_id, created_at, edited_at, employee_id, price, number) VALUES
('Oven', 1, NOW(), NOW(), 1, 200, 2),
('Refrigerator', 2, NOW(), NOW(), 2, 300, 1),
('Cooking Pot', 3, NOW(), NOW(), 3, 50, 10),
('Table', 4, NOW(), NOW(), 4, 100, 5),
('Knife Set', 1, NOW(), NOW(), 5, 75, 3);
