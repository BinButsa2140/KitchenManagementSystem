/*
  Warnings:

  - You are about to drop the column `booking_time` on the `bookings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "booking_time",
ADD COLUMN     "end_time" TIMESTAMP(3),
ADD COLUMN     "start_time" TIMESTAMP(3),
ADD COLUMN     "total_price" DECIMAL(65,30);
