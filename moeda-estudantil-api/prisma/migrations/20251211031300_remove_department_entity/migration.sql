/*
  Warnings:

  - You are about to drop the column `departmentId` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the `Department` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_institutionId_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_departmentId_fkey";

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "departmentId";

-- DropTable
DROP TABLE "Department";
