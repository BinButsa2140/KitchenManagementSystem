CREATE TYPE customer_type AS ENUM ('chef', 'customer');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE employee_status_type AS ENUM ('active', 'inactive');
CREATE TYPE room_type AS ENUM ('kitchen', 'storage', 'course');
CREATE TYPE booking_status_type AS ENUM ('active', 'inactive', 'cancelled');

CREATE TABLE Departments (
  department_id SERIAL PRIMARY KEY,
  department_name VARCHAR(191) NOT NULL,
  rate NUMERIC(65,30) NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  edited_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Customers (
  customer_id SERIAL PRIMARY KEY,
  firstname VARCHAR(191) NOT NULL,
  lastname VARCHAR(191) NOT NULL,
  date_of_birth TIMESTAMP(3) NOT NULL,
  customer_type customer_type NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password VARCHAR(191) NOT NULL,
  phone_number VARCHAR(191) NOT NULL UNIQUE,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  edited_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Employees (
  employee_id SERIAL PRIMARY KEY,
  firstname VARCHAR(191) NOT NULL,
  lastname VARCHAR(191) NOT NULL,
  gender gender_type NOT NULL,
  phone_number VARCHAR(191) NOT NULL UNIQUE,
  email VARCHAR(191) NOT NULL UNIQUE,
  password VARCHAR(191) NOT NULL,
  date_of_birth TIMESTAMP(3) NOT NULL,
  department_id INT NULL,
  employee_status employee_status_type NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  edited_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT Employees_department_id_fkey
    FOREIGN KEY (department_id)
    REFERENCES Departments(department_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

CREATE TABLE Rooms (
  room_id SERIAL PRIMARY KEY,
  room_name VARCHAR(191) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  room_type room_type NOT NULL
);

CREATE TABLE Bookings (
  booking_id SERIAL PRIMARY KEY,
  customer_id INT NOT NULL,
  room_id INT NOT NULL,
  booking_time TIMESTAMP(3) NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  edited_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  booking_status booking_status_type NOT NULL,
  CONSTRAINT Bookings_customer_id_fkey
    FOREIGN KEY (customer_id)
    REFERENCES Customers(customer_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT Bookings_room_id_fkey
    FOREIGN KEY (room_id)
    REFERENCES Rooms(room_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE TABLE Equipments (
  equipment_id SERIAL PRIMARY KEY,
  equipment_name VARCHAR(191) NOT NULL,
  room_id INT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  edited_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  employee_id INT NOT NULL,
  price INT NOT NULL,
  number INT NOT NULL,
  CONSTRAINT Equipments_room_id_fkey
    FOREIGN KEY (room_id)
    REFERENCES Rooms(room_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT Equipments_employee_id_fkey
    FOREIGN KEY (employee_id)
    REFERENCES Employees(employee_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);

CREATE TABLE _EmployeesToRooms (
  A INT NOT NULL,
  B INT NOT NULL,
  PRIMARY KEY (A, B),
  CONSTRAINT _EmployeesToRooms_A_fkey
    FOREIGN KEY (A)
    REFERENCES Employees(employee_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT _EmployeesToRooms_B_fkey
    FOREIGN KEY (B)
    REFERENCES Rooms(room_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);