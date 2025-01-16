/*
  Warnings:

  - Added the required column `password` to the `Customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `customers` ADD COLUMN `password` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `employees` ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL;
