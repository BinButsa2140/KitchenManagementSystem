/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `Customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone_number]` on the table `Employees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Employees` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Customers_email_key` ON `Customers`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Customers_phone_number_key` ON `Customers`(`phone_number`);

-- CreateIndex
CREATE UNIQUE INDEX `Employees_phone_number_key` ON `Employees`(`phone_number`);

-- CreateIndex
CREATE UNIQUE INDEX `Employees_email_key` ON `Employees`(`email`);
