/*
  Warnings:

  - You are about to drop the column `companyId` on the `contact` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `contact` DROP FOREIGN KEY `contact_companyId_fkey`;

-- DropIndex
DROP INDEX `contact_companyId_fkey` ON `contact`;

-- AlterTable
ALTER TABLE `contact` DROP COLUMN `companyId`,
    ADD COLUMN `deviceId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `contact` ADD CONSTRAINT `contact_deviceId_fkey` FOREIGN KEY (`deviceId`) REFERENCES `device_whatsapp`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
