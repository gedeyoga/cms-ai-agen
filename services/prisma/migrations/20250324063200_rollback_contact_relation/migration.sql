/*
  Warnings:

  - You are about to drop the column `deviceId` on the `contact` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `contact` DROP FOREIGN KEY `contact_deviceId_fkey`;

-- DropIndex
DROP INDEX `contact_deviceId_fkey` ON `contact`;

-- AlterTable
ALTER TABLE `contact` DROP COLUMN `deviceId`,
    ADD COLUMN `companyId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `contact` ADD CONSTRAINT `contact_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
