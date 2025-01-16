/*
  Warnings:

  - Added the required column `booking_time` to the `Bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bookings` ADD COLUMN `booking_time` DATETIME(3) NOT NULL;
