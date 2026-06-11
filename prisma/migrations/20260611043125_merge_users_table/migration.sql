/*
  Warnings:

  - You are about to drop the column `customer_id` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `employee_id` on the `equipments` table. All the data in the column will be lost.
  - You are about to drop the `_EmployeesToRooms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `employees` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `equipments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('customer', 'chef', 'employee');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive');

-- DropForeignKey
ALTER TABLE "_EmployeesToRooms" DROP CONSTRAINT "_EmployeesToRooms_A_fkey";

-- DropForeignKey
ALTER TABLE "_EmployeesToRooms" DROP CONSTRAINT "_EmployeesToRooms_B_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_department_id_fkey";

-- DropForeignKey
ALTER TABLE "equipments" DROP CONSTRAINT "equipments_employee_id_fkey";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "customer_id",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "equipments" DROP COLUMN "employee_id",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_EmployeesToRooms";

-- DropTable
DROP TABLE "customers";

-- DropTable
DROP TABLE "employees";

-- DropEnum
DROP TYPE "CustomerType";

-- DropEnum
DROP TYPE "EmployeeStatus";

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "user_type" "UserType" NOT NULL DEFAULT 'customer',
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "user_status" "UserStatus" NOT NULL DEFAULT 'active',
    "gender" "Gender",
    "department_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "edited_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "_RoomsToUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_RoomsToUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE INDEX "_RoomsToUsers_B_index" ON "_RoomsToUsers"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipments" ADD CONSTRAINT "equipments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomsToUsers" ADD CONSTRAINT "_RoomsToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "rooms"("room_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomsToUsers" ADD CONSTRAINT "_RoomsToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
