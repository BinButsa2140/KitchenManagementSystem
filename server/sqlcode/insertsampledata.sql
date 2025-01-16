-- Insert data into Departments
INSERT INTO Departments (department_name, rate, created_at, edited_at)
VALUES
('Admin', 50.00, NOW(), NOW()),
('Cleaner', 20.00, NOW(), NOW()),
('Chef', 40.00, NOW(), NOW()),
('Manager', 60.00, NOW(), NOW()),
('Maintenance', 30.00, NOW(), NOW());

-- Insert data into Customers
INSERT INTO Customers (firstname, lastname, date_of_birth, customer_type, email, phone_number, created_at, edited_at)
VALUES
('John', 'Doe', '1985-05-15', 'customer', 'johndoe@example.com', '1234567890', NOW(), NOW()),
('Jane', 'Smith', '1990-07-22', 'chef', 'janesmith@example.com', '0987654321', NOW(), NOW()),
('Sam', 'Brown', '1978-03-18', 'customer', 'sambrown@example.com', '1122334455', NOW(), NOW()),
('Lucy', 'Taylor', '1995-11-09', 'customer', 'lucytaylor@example.com', '6677889900', NOW(), NOW()),
('Mike', 'Wilson', '1988-01-25', 'chef', 'mikewilson@example.com', '3344556677', NOW(), NOW());

-- Insert data into Employees
INSERT INTO Employees (firstname, lastname, gender, phone_number, date_of_birth, department_id, employee_status, created_at, edited_at)
VALUES
('Alice', 'Johnson', 'female', '555123456', '1985-05-15', 1, 'active', NOW(), NOW()),
('Bob', 'Taylor', 'male', '555654321', '1990-06-22', 2, 'inactive', NOW(), NOW()),
('Charlie', 'Davis', 'other', '555111222', '1988-03-19', 3, 'active', NOW(), NOW()),
('Diana', 'White', 'female', '555333444', '1992-07-10', 4, 'active', NOW(), NOW()),
('Evan', 'Green', 'male', '555666777', '1986-01-25', 5, 'inactive', NOW(), NOW());

-- Insert data into Rooms
INSERT INTO Rooms (room_name, room_type)
VALUES
('Main Kitchen', 'kitchen'),
('Storage Room A', 'storage'),
('Course Room 1', 'course'),
('Main Office', 'kitchen'),
('Equipment Room', 'storage');

-- Insert data into Equipments
INSERT INTO Equipments (equipment_name, room_id, created_at, edited_at, employee_id, price, number)
VALUES
('Oven', 1, NOW(), NOW(), 1, 5000, 2),
('Fridge', 2, NOW(), NOW(), 2, 3000, 1),
('Mixer', 3, NOW(), NOW(), 3, 200, 5),
('Dishwasher', 4, NOW(), NOW(), 4, 1000, 3),
('Microwave', 5, NOW(), NOW(), 5, 800, 4);

-- Insert data into Bookings
INSERT INTO Bookings (customer_id, room_id, created_at, edited_at, booking_status)
VALUES
(1, 1, NOW(), NOW(), 'active'),
(2, 2, NOW(), NOW(), 'cancelled'),
(3, 3, NOW(), NOW(), 'active'),
(4, 4, NOW(), NOW(), 'inactive'),
(5, 5, NOW(), NOW(), 'active');
